const createHttpError = require('http-errors')
const db = require('../models')
const moment = require('moment')

async function create(payload) {
    const { reductions } = payload
    const caseImpacts = await db.caseImpact.bulkCreate(reductions)

    return caseImpacts
}

async function update(payload) {
    const { addReductions, editReductions, removeReductions } = payload

    const newReductions = addReductions?.length > 0 ? await create({ reductions: addReductions }) : []

    if (editReductions?.length > 0) {
        for (let reduction of editReductions) {
            let { reductionId: id } = reduction
            await db.caseImpact.update(reduction, { where: { id } })
        }
    }

    if (removeReductions?.length > 0) {
        const reductionsIdArr = []
        for (let reduction of removeReductions) { reductionsIdArr.push(reduction?.reductionId) }
        await db.caseImpact.destroy({ where: { id: { [db.Sequelize.Op.in]: reductionsIdArr } } })
    }

    return { newReductions, editReductions, removeReductions }
}

async function list(opportunityId, scopes) {
    let scopeArray = [1, 2]
    if (scopes) {
        scopes = scopes.replace(/'/g, '"')
        try {
            scopeArray = JSON.parse(scopes)
        } catch (error) { console.log('query parameters parsing error', error) }
    }
    const businessCase = await db.businessCase.findOne({ where: { opportunity_id: opportunityId }, raw: true })

    let [discount] = await db.sequelize.query(`SELECT
        value / 100 as rate,
        1 + (value / 100) as multiplier
        from setting
        where setting_name = 'cashDiscountRate'
    `)

    let caseImpacts
    if (businessCase) {
        caseImpacts = await db.caseImpact.findAll({
            where: { business_case_id: businessCase.id },
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [{
                model: db.businessCase,
                attributes: ['id'],
                include: [{
                    model: db.scenario,
                    attributes: ['id', 'baseline_start_date']
                }, {
                    model: db.opportunity,
                    attributes: ['id', 'location_id']
                }],
            }, {
                model: db.resource,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [{
                    model: db.caseEmissionsFactor,
                    attributes: ['scope1', 'scope2', 'scope3'],
                    required: false,
                    where: {
                        resource_id: { [db.Sequelize.Op.col]: 'resource.id' },
                        year_offset: { [db.Sequelize.Op.col]: 'caseImpact.year_offset' },
                        location_id: { [db.Sequelize.Op.col]: 'businessCase.opportunity.location_id' },
                    }
                }, {
                    model: db.caseEmissionsFactor,
                    attributes: ['id', 'scope1', 'scope2', 'scope3'],
                    as: 'case_emissions_factors',
                    required: false,
                    where: {
                        resource_id: { [db.Sequelize.Op.col]: 'resource.id' },
                        year_offset: { [db.Sequelize.Op.eq]: null },
                        location_id: {
                            [db.Sequelize.Op.or]: [
                                { [db.Sequelize.Op.col]: 'businessCase.opportunity.location_id' },
                                { [db.Sequelize.Op.eq]: null }
                            ]
                        },
                    }
                }, {
                    model: db.contract,
                    include: [{
                        model: db.contractPeriod,
                        include: { model: db.contractPricing }
                    }],
                }, {
                    model: db.unit,
                    attributes: ['id', 'name', 'is_base'],
                    include: [{
                        model: db.unitConversion,
                        as: 'unitFrom',
                        attributes: ['id', 'unit_from_id', 'unit_to_id', 'multiplier'],
                        required: false,
                        where: { unit_from_id: { [db.Sequelize.Op.col]: 'resource.unit.id' }, unit_to_id: { [db.Sequelize.Op.col]: 'resource.preferred_unit' } }
                    }]
                }, {
                    model: db.unit,
                    as: 'preferredUnit',
                    attributes: ['id', 'name', 'is_base']
                }],
            }]
        })
    }

    caseImpacts = caseImpacts && JSON.parse(JSON.stringify(caseImpacts))

    let caseImpactsArray = []
    if (caseImpacts) {
        for (let caseImpactIndex = 0; caseImpactIndex < caseImpacts.length; caseImpactIndex++) {
            let caseImpact = caseImpacts[caseImpactIndex]
            let returnObject = {}
            if (caseImpact?.resource) {
                // eslint-disable-next-line no-unused-vars
                let { businessCase, resource: { caseEmissionsFactors, case_emissions_factors, contract, unit, ...resourceData }, ...caseImpactData } = caseImpact
                let value = 0
                if (caseEmissionsFactors && caseEmissionsFactors.length > 0) {
                    value = caseEmissionsFactors.reduce((value, factor) => {
                        const { scope1, scope2, scope3 } = factor
                        let retrunValue = parseFloat(value)
                        if (scopeArray.includes(parseInt('1'))) { retrunValue = retrunValue + (parseFloat(scope1) ? parseFloat(scope1) : 0) }
                        if (scopeArray.includes(parseInt('2'))) { retrunValue = retrunValue + (parseFloat(scope2) ? parseFloat(scope2) : 0) }
                        if (scopeArray.includes(parseInt('3'))) { retrunValue = retrunValue + (parseFloat(scope3) ? parseFloat(scope3) : 0) }

                        return retrunValue
                    }, 0)
                } else if (case_emissions_factors && case_emissions_factors.length > 0) {
                    value = case_emissions_factors.reduce((value, factor) => {
                        const { scope1, scope2, scope3 } = factor
                        let retrunValue = parseFloat(value)
                        if (scopeArray.includes(parseInt('1'))) { retrunValue = retrunValue + (parseFloat(scope1) ? parseFloat(scope1) : 0) }
                        if (scopeArray.includes(parseInt('2'))) { retrunValue = retrunValue + (parseFloat(scope2) ? parseFloat(scope2) : 0) }
                        if (scopeArray.includes(parseInt('3'))) { retrunValue = retrunValue + (parseFloat(scope3) ? parseFloat(scope3) : 0) }

                        return retrunValue
                    }, 0)
                }
                let co2 = value * caseImpactData?.change / 1000 || 0

                returnObject = { ...caseImpactData, price: 0, cost: 0, co2Reduction: co2, npv: 0, resource: { ...resourceData, unit, contract } }
            }
            if (caseImpact?.businessCase) {
                const { scenario, opportunity } = caseImpact.businessCase
                const impactDate = moment(scenario.baseline_start_date).add(caseImpact.year_offset, 'years').format('YYYY-MM-DD')
                const queryObject = {
                    scenario_id: scenario.id,
                    resource_id: caseImpact.resource_id,
                    start_date: { [db.Sequelize.Op.lte]: impactDate },
                    end_date: { [db.Sequelize.Op.gte]: impactDate },
                    location_id: opportunity.location_id
                }
                const caseResourcePrice = await db.caseResourcePrice.findOne({ where: queryObject, attributes: ['price'], raw: true })
                returnObject['price'] = caseResourcePrice?.price || 0
                returnObject['cost'] = caseResourcePrice?.price * caseImpact.change || 0
                returnObject['npv'] = (caseResourcePrice?.price * caseImpact.change) / Math.pow(discount?.[0].multiplier, caseImpact?.year_offset) || 0
            }
            caseImpactsArray.push(returnObject)
        }
    }

    return caseImpactsArray
}

async function getResourcePrice(payload) {
    if (!payload.business_case_id || !payload.resource_id) throw new createHttpError[400]('please provide business_case_id and resource_id')
    const { business_case_id, resource_id } = payload
    let businessCase = await db.businessCase.findByPk(business_case_id, {
        attributes: ['id', 'economic_life'],
        include: [{
            model: db.scenario,
            attributes: ['id', 'baseline_start_date']
        }, {
            model: db.opportunity,
            attributes: ['id', 'location_id']
        }]
    })
    if (!businessCase) throw new createHttpError[404]('business case not found')
    businessCase = JSON.parse(JSON.stringify(businessCase))

    const { scenario, opportunity, economic_life } = businessCase
    const start_date = moment(scenario.baseline_start_date).format('YYYY-MM-DD')
    const end_date = moment(scenario.baseline_start_date).add(economic_life, 'years').format('YYYY-MM-DD')
    const queryObject = {
        scenario_id: scenario.id,
        resource_id: resource_id,
        start_date: { [db.Sequelize.Op.lte]: start_date },
        end_date: { [db.Sequelize.Op.gte]: end_date },
        location_id: opportunity.location_id
    }
    const caseResourcePrice = await db.caseResourcePrice.findOne({ where: queryObject, attributes: ['price'], raw: true })

    return { price: caseResourcePrice?.price || 0 }
}

module.exports = { create, update, list, getResourcePrice }
