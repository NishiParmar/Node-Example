const createHttpError = require('http-errors')
const moment = require('moment')
const db = require('../models')
const { VIEWS: viewConstants } = require('../utils/constants')
const { getPermissionData } = require('./userPermission')

async function findOne(opportunityId, userDetails) {
  let opportunityObject = await db.opportunity.findByPk(opportunityId, { attributes: ['business_id'], raw: true })
  if (!opportunityObject) throw new createHttpError[404]('Opportunity not found.')
  const { business_id: businessId } = opportunityObject
  const user = await getPermissionData(userDetails, 'sites', { business_id: businessId }, 'permittedSitesArray')
  let opportunity = await db.opportunity.findByPk(opportunityId, {
    include: [{
      model: db.AllowedSiteView,
      attributes: ['id', 'name', 'business_id', 'location_id'],
      where: { user_id: user.id || null, id: { [db.Sequelize.Op.in]: user.sites } },
      as: 'site',
      required: true
    },
    {
      model: db.businessCase,
      include: [{ model: db.caseCashflow }, { model: db.caseImpact }]
    }]
  })

  if (!opportunity) {
    throw new createHttpError[404]('Opportunity not found.')
  }
  opportunity = JSON.parse(JSON.stringify(opportunity))

  let opportunityResponse = {}
  const [[opportunityDetails]] = await db.sequelize.query(`SELECT projectType, projectTechnology, economic_life, capex, opex, otherCost, business_case_id as businessCaseId, start_date, completion_date, npv,netAnnualSaving FROM ${viewConstants.OPPORTUNITY_LIST_VIEW} WHERE opportunity_id= ${opportunityId}`)

  if (opportunity?.businessCase) {
    let { businessCase: { caseCashflows, caseImpacts }, ...rest } = opportunity
    const payback = opportunityDetails?.capex / parseFloat(opportunityDetails?.netAnnualSaving) || 0
    opportunityResponse = { ...rest, ...opportunityDetails, payback, caseCashflows, caseImpacts }
  } else {
    opportunityResponse = { ...opportunity, ...opportunityDetails }
  }

  return opportunityResponse
}

async function list(businessId, userDetails) {
  const user = await getPermissionData(userDetails, 'sites', null, 'allPermittedSitesPerBusinesses')
  let opportunities = []
  if (user) {
    let opportunity = await db.opportunity.findAll(
      {
        where: { business_id: businessId },
        include: [
          { model: db.OpportunityListView, as: 'opportunityDetails' },
          {
            model: db.AllowedSiteView,
            attributes: ['id', 'name', 'business_id', 'location_id'],
            where: { user_id: user.id, business_id: businessId, id: { [db.Sequelize.Op.in]: user.sites } },
            as: 'site',
            required: true
          },
          { model: db.businessCase, include: [{ model: db.caseCashflow }, { model: db.caseImpact }] }
        ]
      })
    opportunity = JSON.parse(JSON.stringify(opportunity))

    opportunities = opportunity.map((opportunity) => {
      let { businessCase, opportunityDetails, ...rest } = opportunity
      let caseCashflows = businessCase?.caseCashflows
      let caseImpacts = businessCase?.caseImpacts

      return { ...rest, ...opportunityDetails, caseCashflows, caseImpacts }
    })
  }

  return opportunities
}

async function create(payload) {
  if (!payload.business_id) throw new createHttpError[422]('Valid business id is required!')

  // searching for existing scenario for the business
  const opportunities = await db.opportunity.findAll({ where: { business_id: payload.business_id }, attributes: ['id'], raw: true })
  const opportunityIdArray = opportunities.map(opp => opp.id)
  const business_case = await db.businessCase.findOne({ where: { opportunity_id: { [db.Sequelize.Op.in]: opportunityIdArray }, scenario_id: { [db.Sequelize.Op.ne]: null } }, attributes: ['id', 'scenario_id'], raw: true })

  // finding the scenario or creating the new one if doesnot exist for the business
  let scenario
  if (business_case?.scenario_id) {
    scenario = await db.scenario.findOne({ where: { id: business_case?.scenario_id }, raw: true })
  } else {
    if (!payload.start_date) throw new createHttpError[422]('Please provide start_date!')
    scenario = await db.scenario.create({
      name: 'Test Scenario',
      baseline_start_date: payload.start_date
    })
  }

  const opportunity = await db.opportunity.create(payload)

  const businessCase = await db.businessCase.create({
    opportunity_id: opportunity.id,
    scenario_id: scenario.id,
    start_date: payload.start_date,
    completion_date: payload.completion_date,
    economic_life: payload.economic_life
  })

  return { opportunity, scenario, businessCase }
}

async function getOppCost(payload) {
  const opportunity = await db.opportunity.findByPk(payload.opportunityId)
  if (!opportunity) return []
  const [results] = await db.sequelize.query(`WITH recursive years AS (
    SELECT
       0 year_offset
    UNION
    ALL
    SELECT
       year_offset + 1
    FROM
       years
    WHERE
       year_offset < 10
  )
  SELECT
    years.year_offset,
    opportunity.id,
    opportunity.business_id,
    SUM(COALESCE(cost_capex.cashflow, 0)) capex,
    SUM(COALESCE(cost_opex.cashflow, 0)) opex,
    SUM(COALESCE(cost_opex.cashflow, 0)) otherCost,
    cost_other.type AS otherCostName
  FROM
    (years, opportunity)
    JOIN business_case ON business_case.opportunity_id = opportunity.id
    JOIN scenario ON scenario.id = business_case.scenario_id
    JOIN case_emissions_factor ON case_emissions_factor.scenario_id = scenario.id
    LEFT JOIN case_cashflow cost_opex ON cost_opex.business_case_id = business_case.id
    AND cost_opex.year_offset <= years.year_offset
    AND cost_opex.type LIKE '%OPEX%'
    LEFT JOIN case_cashflow cost_capex ON cost_capex.business_case_id = business_case.id
    AND cost_capex.year_offset <= years.year_offset
    AND cost_capex.type LIKE '%CAPEX%'
    LEFT JOIN case_cashflow cost_other ON cost_opex.business_case_id = business_case.id
    AND cost_opex.year_offset <= years.year_offset
    AND cost_opex.type NOT LIKE '%OPEX%'
    AND cost_opex.type NOT LIKE '%CAPEX%'
  WHERE
    opportunity.business_id = ${opportunity.business_id}
    AND opportunity.id = ${payload.opportunityId}
  GROUP BY
    opportunity.id,
    years.year_offset
    ORDER BY
    opportunity.id,
    years.year_offset;`)

  return results
}

async function getReductionData(oppId) {
  const opportunity = await db.opportunity.findByPk(oppId)
  if (!opportunity) return []

  const [results] = await db.sequelize.query(`SELECT * FROM ${viewConstants.REDUCTION_VIEW}
  WHERE
    business_id = ${opportunity.business_id} AND
    opportunity_id = ${opportunity.id}
  `)

  return results
}

async function convert(oppId, payload) {
  const opportunity = await db.opportunity.findByPk(oppId, { raw: true })
  let responseObject = {}
  if (opportunity) {
    const { id, parent_id, business_id, site_id, name, description } = opportunity

    const businessCase = await db.businessCase.findOne({
      where: { opportunity_id: id },
      include: [
        { model: db.caseCashflow },
        { model: db.caseImpact },
        {
          model: db.scenario,
          attributes: ['id', 'baseline_start_date']
        },
        {
          model: db.opportunity,
          attributes: ['id', 'location_id']
        }]
    })

    let start_date = payload?.start_date
    if (start_date && moment(start_date) == moment(businessCase?.start_date)) start_date = null

    const project = await db.project.create({
      parent_id,
      business_id,
      site_id: site_id ? site_id : null,
      name,
      description,
      economic_life: businessCase?.economic_life,
      start_date: start_date ? start_date : businessCase?.start_date
    })

    // adding cashflows data from caseCashflows
    const caseCashflows = businessCase?.caseCashflows && JSON.parse(JSON.stringify(businessCase?.caseCashflows))
    let cashFlows = [], cashFlowIdArray = []
    if (caseCashflows?.length > 0) {
      const cashflowsArray = caseCashflows?.map((caseCashflow) => {
        const { id, name, year_offset, cashflow, type } = caseCashflow
        cashFlowIdArray.push(id)

        return { project_id: project.id, name, year_offset, cashflow, type }
      })
      cashFlows = await db.cashflow.bulkCreate(cashflowsArray)
      await db.caseCashflow.destroy({ where: { id: { [db.Sequelize.Op.in]: cashFlowIdArray } } })
    }

    // adding impact data from caseImpacts
    const caseImpacts = businessCase?.caseImpacts && JSON.parse(JSON.stringify(businessCase?.caseImpacts))
    let impacts = [], impactIdArray = [], contract = {}, contractPeriodId = null, resourceId, impactsArray = []

    if (caseImpacts?.length > 0) {
      for (let impactIndex = 0; impactIndex < caseImpacts.length; impactIndex++) {
        const caseImpact = caseImpacts[impactIndex]
        const { id, resource_id, ...rest } = caseImpact
        impactIdArray.push(id)
        let returnObject = { project_id: project.id, ...rest }

        if (resource_id != resourceId) {
          const contractObject = await db.contract.findOne({
            where: { resource_id },
            include: {
              model: db.contractPeriod,
              where: { start_date: businessCase.start_date }
            }
          })
          contract = JSON.parse(JSON.stringify(contractObject))
          resourceId = resource_id
          contractPeriodId = contract ? contract.contractPeriods?.[0]?.id : null
        }
        returnObject = { ...returnObject, contract_period_id: contractPeriodId }

        const { scenario, opportunity } = businessCase
        const impactDate = moment(scenario.baseline_start_date).add(caseImpact.year_offset, 'years').format('YYYY-MM-DD')
        const queryObject = {
          scenario_id: scenario.id,
          resource_id: caseImpact.resource_id,
          start_date: { [db.Sequelize.Op.lte]: impactDate },
          end_date: { [db.Sequelize.Op.gte]: impactDate },
          location_id: opportunity.location_id
        }
        const caseResourcePrice = await db.caseResourcePrice.findOne({ where: queryObject, attributes: ['id', 'price'], raw: true })
        returnObject = { ...returnObject, cost: (caseResourcePrice?.price * caseImpact.change || 0) }

        impactsArray.push(returnObject)
      }
      impacts = await db.impact.bulkCreate(impactsArray)
      await db.caseImpact.destroy({ where: { id: { [db.Sequelize.Op.in]: impactIdArray } } })
    }

    // adding emissions factor data from caseEmissionsFactor
    const scenarioId = businessCase?.scenario_id
    let emissionFactors = []
    if (scenarioId) {
      const scenario = await db.scenario.findByPk(scenarioId, { include: { model: db.caseEmissionsFactor, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } } })
      // include db.resource -> db.emission
      const caseEmissionFactorsArray = scenario?.caseEmissionsFactors && JSON.parse(JSON.stringify(scenario?.caseEmissionsFactors))
      if (caseEmissionFactorsArray?.length > 0) {
        let emissionFactorsIdArray = [], emissionFactorsArr = []

        if (start_date) {
          caseEmissionFactorsArray.forEach((ele) => {
            let emissionFactorsObject = {}
            let { id, location_id, start_date: startDate, end_date: endDate, ...rest } = ele
            emissionFactorsIdArray.push(id)
            const duration = moment(endDate).diff(startDate, 'days')
            startDate = moment(start_date).format('YYYY-MM-DD')
            endDate = moment(startDate).add(duration, 'days').format('YYYY-MM-DD')
            emissionFactorsObject = { location_id: location_id ? location_id : null, start_date: startDate, end_date: endDate, ...rest }
            emissionFactorsArr.push(emissionFactorsObject)
          })
        } else {
          caseEmissionFactorsArray.forEach((ele) => {
            const { id, location_id, ...rest } = ele
            emissionFactorsIdArray.push(id)
            emissionFactorsArr.push({ location_id: location_id ? location_id : null, ...rest })
          })
        }
        emissionFactors = await db.emissionsFactor.bulkCreate(emissionFactorsArr)
        // await db.caseEmissionsFactor.destroy({ where: { id: { [db.Sequelize.Op.in]: emissionFactorsIdArray } } })
      }
    }
    await db.opportunity.destroy({ where: { id: oppId } })
    responseObject = { project, cashFlows, emissionFactors, impacts }
  } else {
    throw new createHttpError[404]('Opportunity not found.')
  }

  return responseObject
}

async function update(query, payload) {
  const start_date = payload?.start_date
  const completion_date = payload?.completion_date
  const economic_life = payload?.economic_life

  if (start_date || completion_date || economic_life) {
    let updateObject = {}
    updateObject = start_date ? { ...updateObject, start_date } : updateObject
    updateObject = completion_date ? { ...updateObject, completion_date } : updateObject

    if (economic_life) {
      updateObject = economic_life ? { ...updateObject, economic_life } : updateObject

      const businessCase = await db.businessCase.findOne({ where: { opportunity_id: query.id }, raw: true })
      if (businessCase && businessCase.economic_life > economic_life) {
        const caseCashflowFilter = { business_case_id: businessCase.id, year_offset: { [db.Sequelize.Op.gte]: economic_life } }
        await db.caseCashflow.destroy({ where: caseCashflowFilter })
        const caseImpactFilter = { business_case_id: businessCase.id, year_offset: { [db.Sequelize.Op.gte]: economic_life } }
        await db.caseImpact.destroy({ where: caseImpactFilter })
      }
    }
    await db.businessCase.update(updateObject, { where: { opportunity_id: query.id } })

  }
  const opportunity = await db.opportunity.update(payload, { where: query })

  return opportunity
}

async function opportunityLocations(query) {
  const businessCase = await db.businessCase.findOne({ where: { opportunity_id: query.id }, raw: true })
  const scenario_id = businessCase?.scenario_id
  let locations = []
  if (scenario_id) {
    [locations] = await db.sequelize.query(`SELECT DISTINCT location.* FROM location JOIN case_emissions_factor ON case_emissions_factor.location_id = location.id AND case_emissions_factor.scenario_id = ${scenario_id}`)
  }

  return locations
}

module.exports = { findOne, list, create, getOppCost, getReductionData, convert, update, opportunityLocations }
