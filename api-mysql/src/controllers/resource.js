const createHttpError = require('http-errors')
const moment = require('moment')
const db = require('../models')
const { getPermittedDataArrays } = require('./userPermission')
const { EMISSION_FACTOR_DEFAULT_START_DATE, EMISSION_FACTOR_DEFAULT_END_DATE } = require('../utils/codeConstants')

async function list(payload) {
  let { business_id: businessId, isContractedResources } = payload

  let queryObject = {}
  if (businessId) {
    queryObject = { business_id: businessId }
  } else throw new createHttpError[404]('business not found')

  switch (isContractedResources) {
    case true:
      queryObject = { ...queryObject, '$resource.contract.id$': { [db.Sequelize.Op.ne]: null } }
      break
    case false:
      queryObject = { ...queryObject, '$resource.contract.id$': { [db.Sequelize.Op.eq]: null } }
      break
    default:
      break
  }

  let resources = await db.businessResource.findAll({
    where: queryObject,
    include: [
      {
        model: db.resource,
        include: [
          {
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
          }, {
            model: db.contract
          }],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
  })

  return resources
}

async function findOne(resourceId) {
  const resource = await db.resource.findByPk(resourceId)

  if (!resource) {
    throw new createHttpError[404]('resource not found.')
  }

  return resource
}

async function create(userDetails, payload) {
  const { business_id, emission: emissionParams, resource: resourceParams, baseFactor, emissionsFactors: factors } = payload
  if (!business_id) throw new createHttpError[422]('business_id cannot be null')
  const { businessArray: allowedBusinesses } = await getPermittedDataArrays(userDetails, ['businesses'])
  if (!allowedBusinesses?.includes(parseInt(business_id))) throw new createHttpError[400]('you dont have necessary permissions for this action!')

  let resource, businessResource, emission
  if (emissionParams && Object.keys(emissionParams).length > 0) {
    const emission_id = emissionParams?.id
    if (emission_id) {
      const emissionFilter = { where: { id: emission_id } }
      emission = await db.emission.findOne(emissionFilter, { attributes: ['business_id'] })
      if (!emission) throw new createHttpError[422]('emission not found!')
      const resourcePayload = { business_id, emission_id, ...resourceParams }
      resource = await db.resource.create(resourcePayload)
      const resource_id = resource.id
      businessResource = await db.businessResource.create({ business_id, resource_id, ...resourceParams })

      if (emission?.business_id && emission?.business_id == business_id) {
        const emissionPayload = { business_id, ...emissionParams }
        emission = await db.emission.update(emissionPayload, emissionFilter)

        if (baseFactor && (typeof baseFactor == 'object')) {
          await addBaseEmissionFactor(baseFactor, emission_id)
        }

        if (factors?.length > 0) {
          for (let factorIndex = 0; factorIndex < factors.length; factorIndex++) {
            const emissionFactorObject = factors[factorIndex]
            const { id: emissionFactorId, start_date, end_date } = emissionFactorObject
            const factorDates = { start_date, end_date }
            if (emissionFactorId) {
              const dates = await validateEmissionFactorDates(factorDates, emission_id, emissionFactorId)
              await db.emissionsFactor.update({ ...emissionFactorObject, ...dates }, { where: { id: emissionFactorId } })
            } else {
              const dates = await validateEmissionFactorDates(factorDates, emission_id)
              emissionFactorObject['emission_id'] = emission_id
              await db.emissionsFactor.create({ ...emissionFactorObject, ...dates })
            }
          }
        }
      }
    } else {
      const emissionPayload = { business_id, ...emissionParams }
      emission = await db.emission.create(emissionPayload)

      const emission_id = emission.id
      const resourcePayload = { business_id, emission_id, ...resourceParams }
      resource = await db.resource.create(resourcePayload)
      const resource_id = resource.id
      businessResource = await db.businessResource.create({ business_id, resource_id, ...resourceParams })

      if (baseFactor && (typeof baseFactor == 'object')) {
        await addBaseEmissionFactor(baseFactor, emission_id)
      }

      if (factors?.length > 0) {
        for (let factorIndex = 0; factorIndex < factors.length; factorIndex++) {
          const emissionFactorObject = factors[factorIndex]
          const { start_date, end_date } = emissionFactorObject
          const factorDates = { start_date, end_date }
          const dates = await validateEmissionFactorDates(factorDates, emission_id)
          await db.emissionsFactor.create({ ...emissionFactorObject, emission_id, ...dates })
        }
      }
    }
  }

  return { emission, resource, businessResource }
}

async function update(userDetails, query, payload) {
  const { business_id, emission: emissionParams, resource: resourceParams, baseFactor, emissionsFactors } = payload
  if (!business_id) throw new createHttpError[422]('business_id cannot be null')
  const { businessArray: allowedBusinesses } = await getPermittedDataArrays(userDetails, ['businesses'])
  if (!allowedBusinesses?.includes(parseInt(business_id))) throw new createHttpError[400]('you dont have necessary permissions for this action!')

  const resource = await db.resource.update(resourceParams, { where: query })

  let emission
  if (emissionParams && Object.keys(emissionParams).length > 0) {
    const emission_id = emissionParams?.id
    if (emission_id) {
      const emissionFilter = { where: { id: emission_id } }
      emission = await db.emission.findOne(emissionFilter, { attributes: ['business_id'] })
      if (!emission) throw new createHttpError[422]('emission not found!')
      await db.resource.update({ emission_id }, { where: query })
      if (emission?.business_id && emission?.business_id == business_id) {
        emission = await db.emission.update({ business_id, ...emissionParams }, emissionFilter)

        if (baseFactor && (typeof baseFactor == 'object')) {
          await addBaseEmissionFactor(baseFactor, emission_id)
        }

        if (emissionsFactors?.length > 0) {
          for (let factorIndex = 0; factorIndex < emissionsFactors.length; factorIndex++) {
            const emissionFactorObject = emissionsFactors[factorIndex]
            const { id: emissionFactorId, start_date, end_date } = emissionFactorObject
            const factorDates = { start_date, end_date }
            if (emissionFactorId) {
              const dates = await validateEmissionFactorDates(factorDates, emission_id, emissionFactorId)
              await db.emissionsFactor.update({ ...emissionFactorObject, ...dates }, { where: { id: emissionFactorId } })
            } else {
              const dates = await validateEmissionFactorDates(factorDates, emission_id)
              emissionFactorObject['emission_id'] = emission_id
              await db.emissionsFactor.create({ ...emissionFactorObject, ...dates })
            }
          }
        }
      }
    } else {
      const emissionPayload = { business_id, ...emissionParams }
      const emission = await db.emission.create(emissionPayload)
      const emission_id = emission.id

      const resourcePayload = { emission_id }
      await db.resource.update(resourcePayload, { where: query })

      if (baseFactor && (typeof baseFactor == 'object')) {
        await addBaseEmissionFactor(baseFactor, emission_id)
      }

      if (emissionsFactors?.length > 0) {
        for (let factorIndex = 0; factorIndex < emissionsFactors.length; factorIndex++) {
          const emissionFactorObject = emissionsFactors[factorIndex]
          const { start_date, end_date } = emissionFactorObject
          const factorDates = { start_date, end_date }
          const dates = await validateEmissionFactorDates(factorDates, emission_id)
          await db.emissionsFactor.create({ ...emissionFactorObject, emission_id, ...dates })
        }
      }
    }
  }

  return { resource, emission }
}

async function validateEmissionFactorDates(dates, emission_id, emission_factor_id) {
  let { start_date, end_date } = dates
  start_date = moment(start_date).format('YYYY-MM-DD')
  end_date = moment(end_date).format('YYYY-MM-DD')
  const isEndDateAfterStartDate = moment(end_date).isAfter(start_date)
  if (!isEndDateAfterStartDate) throw new createHttpError[400]('End date cannot be start before start date')

  let emissionFactorQuery = { emission_id }
  if (emission_factor_id) emissionFactorQuery['id'] = { [db.Sequelize.Op.ne]: emission_factor_id }
  const existingEmissionFactors = await db.emissionsFactor.findAll({ where: emissionFactorQuery, raw: true })

  for (let factor of existingEmissionFactors) {
    let { start_date: existingFactorStartDate, end_date: existingFactorEndDate } = factor
    existingFactorStartDate = existingFactorStartDate && moment(existingFactorStartDate).format('YYYY-MM-DD')
    existingFactorEndDate = existingFactorEndDate && moment(existingFactorEndDate).format('YYYY-MM-DD')

    const isStartDateBetween = moment(start_date).isBetween(existingFactorStartDate, existingFactorEndDate)
    const isEndDateBetween = moment(end_date).isBetween(existingFactorStartDate, existingFactorEndDate)
    const isExistingStartDateBetween = moment(existingFactorStartDate).isBetween(start_date, end_date)
    const isExistingEndDateBetween = moment(existingFactorEndDate).isBetween(start_date, end_date)

    if (isStartDateBetween || isEndDateBetween || isExistingStartDateBetween || isExistingEndDateBetween) {
      throw new createHttpError[400]('Emission factor already exist with this dates for the emission')
    }
  }

  return { start_date, end_date }
}

async function addBaseEmissionFactor(baseFactor, emission_id) {
  const baseEmissionFactorId = baseFactor?.id
  const baseEmissionFactorObject = { ...baseFactor, emission_id }
  baseEmissionFactorObject['start_date'] = EMISSION_FACTOR_DEFAULT_START_DATE
  baseEmissionFactorObject['end_date'] = EMISSION_FACTOR_DEFAULT_END_DATE
  let baseEmissionFactor
  if (baseEmissionFactorId) {
    baseEmissionFactor = await db.emissionsFactor.update(baseEmissionFactorObject, { where: { id: baseEmissionFactorId } });
  } else {
    baseEmissionFactor = await db.emissionsFactor.create(baseEmissionFactorObject);
  }

  return baseEmissionFactor
}

module.exports = { list, findOne, create, update }
