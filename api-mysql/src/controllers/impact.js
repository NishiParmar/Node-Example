const createHttpError = require('http-errors')
const db = require('../models')
const moment = require('moment/moment')

async function list(projectId, scopes) {
  let queryObject = projectId ? { project_id: projectId } : {}

  let impacts = await db.impact.findAll({
    where: queryObject,
    include: [
      {
        model: db.contractPeriod,
        include: [
          {
            model: db.contract,
            include: {
              model: db.resource,
              attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
              include: [{
                model: db.emissionsFactor,
                attributes: ['scope1', 'scope2', 'scope3'],
                required: false,
                where: {
                  resource_id: { [db.Sequelize.Op.col]: 'contractPeriod.contract.resource.id' },
                  start_date: { [db.Sequelize.Op.col]: 'contractPeriod.start_date' },
                  end_date: { [db.Sequelize.Op.col]: 'contractPeriod.end_date' }
                }
              }, {
                model: db.unit,
                attributes: ['id', 'name', 'is_base'],
                include: [{
                  model: db.unitConversion,
                  as: 'unitFrom',
                  attributes: ['id', 'unit_from_id', 'unit_to_id', 'multiplier'],
                  required: false,
                  where: { unit_from_id: { [db.Sequelize.Op.col]: 'contractPeriod.contract.resource.unit.id' }, unit_to_id: { [db.Sequelize.Op.col]: 'contractPeriod.contract.resource.preferred_unit' } }
                }]
              }, {
                model: db.unit,
                as: 'preferredUnit',
                attributes: ['id', 'name', 'is_base']
              }]
            },
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
          },
          { model: db.contractPricing, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
  })

  impacts = impacts && JSON.parse(JSON.stringify(impacts))

  let impactsArray = []
  if (impacts) {
    impactsArray = impacts.map((impact) => {
      let { contractPeriod, ...impactData } = impact
      let impactObject = { ...impact, co2Reduction: 0, reduction: 0 }

      if (contractPeriod?.contract?.resource?.emissionsFactors?.length > 0) {
        let emissionsFactors = contractPeriod?.contract?.resource?.emissionsFactors
        let scopeArray = [1, 2]
        if (scopes) {
          scopes = scopes.replace(/'/g, '"')
          try {
            scopeArray = JSON.parse(scopes)
          } catch (error) { console.log('query parameters parsing error', error) }
        }
        let value = emissionsFactors.reduce((value, factor) => {
          const { scope1, scope2, scope3 } = factor
          let retrunValue = parseFloat(value)
          if (scopeArray.includes(parseInt('1'))) { retrunValue = retrunValue + (parseFloat(scope1) ? parseFloat(scope1) : 0) }
          if (scopeArray.includes(parseInt('2'))) { retrunValue = retrunValue + (parseFloat(scope2) ? parseFloat(scope2) : 0) }
          if (scopeArray.includes(parseInt('3'))) { retrunValue = retrunValue + (parseFloat(scope3) ? parseFloat(scope3) : 0) }

          return retrunValue
        }, 0)
        let co2 = value * impactData?.change / 1000 || 0

        let { contract, ...contractPeriodData } = contractPeriod
        // eslint-disable-next-line no-unused-vars
        let { resource: { emissionsFactors: factorArray, ...resourceData }, ...contractData } = contract

        impactObject = { ...impactData, co2Reduction: co2, contractPeriod: { ...contractPeriodData, contract: { ...contractData, resource: { ...resourceData } } } }
      }

      return impactObject
    })
  }

  return impactsArray

}

async function findOne(impactId) {
  const impact = await db.impact.findByPk(impactId)

  if (!impact) {
    throw new createHttpError[404]('Impact not found.')
  }

  return impact
}

async function create(payload) {
  const { reductions } = payload
  let impacts = [], start_date, project
  for (let impact of reductions) {
    const { project_id, year_offset, contract_id } = impact
    if (!project) {
      project = await db.project.findByPk(project_id, { raw: true })
      start_date = project?.start_date
    }
    const end_date = moment(start_date).add((year_offset + 1), 'years').format('YYYY-MM-DD')
    const contractPeriod = await db.contractPeriod.findOne({ where: { contract_id, start_date, end_date } })
    impacts.push({ ...impact, contract_period_id: contractPeriod?.id })
  }

  const impact = await db.impact.bulkCreate(impacts)

  return impact
}

async function update(payload) {
  const { addReductions, editReductions, removeReductions } = payload

  const newReductions = addReductions?.length > 0 ? await create({ reductions: addReductions }) : []

  if (editReductions?.length > 0) {
    for (let reduction of editReductions) {
      let { reductionId: id } = reduction
      await db.impact.update(reduction, { where: { id } })
    }
  }

  if (removeReductions?.length > 0) {
    const reductionsIdArr = []
    for (let reduction of removeReductions) { reductionsIdArr.push(reduction?.reductionId) }
    await db.impact.destroy({ where: { id: { [db.Sequelize.Op.in]: reductionsIdArr } } })
  }

  return { newReductions, editReductions, removeReductions }
}

module.exports = { list, findOne, create, update }
