const createHttpError = require('http-errors')
const moment = require('moment')
const db = require('../models')

async function create(payload) {
  let { contract_id, start_date, end_date } = payload
  if (!contract_id || !start_date || !end_date) throw new createHttpError[422]('please provide valid dates and contract parameters')
  const dates = await validateContractPeriodDates({ start_date, end_date }, contract_id)

  const period = await db.contractPeriod.create({ ...payload, ...dates })

  const contractPricing = { contract_period_id: period.id, price: payload.price }
  const pricing = await db.contractPricing.create(contractPricing)

  return { period, pricing }
}

async function update(query, payload) {
  const { contract_id, price, start_date, end_date, projected } = payload
  if (!contract_id || !start_date || !end_date) throw new createHttpError[422]('please provide valid dates and contract parameters')
  const dates = await validateContractPeriodDates({ start_date, end_date }, contract_id, query.id)

  const period = await db.contractPeriod.update({ ...dates, projected }, { where: query })

  const hasPricing = await db.contractPricing.findOne({ where: { contract_period_id: query.id } })
  let pricing
  if (hasPricing) {
    pricing = await db.contractPricing.update({ price }, { where: { contract_period_id: query.id } })

  } else {
    pricing = await db.contractPricing.create({ price, contract_period_id: query.id })
  }

  return { period, pricing }
}

async function validateContractPeriodDates(dates, contract_id, contract_period_id) {
  let { start_date, end_date } = dates
  start_date = moment(start_date).format('YYYY-MM-DD')
  end_date = moment(end_date).format('YYYY-MM-DD')
  const isEndDateAfterStartDate = moment(end_date).isAfter(start_date)
  if (!isEndDateAfterStartDate) throw new createHttpError[400]('End date cannot be start before start date')

  let contractPeriodQuery = { contract_id }
  if (contract_period_id) contractPeriodQuery = { ...contractPeriodQuery, id: { [db.Sequelize.Op.ne]: contract_period_id } }
  const existingContractPeriods = await db.contractPeriod.findAll({ where: contractPeriodQuery, raw: true })

  for (let period of existingContractPeriods) {
    let { start_date: existingPeriodStartDate, end_date: existingPeriodEndDate } = period
    existingPeriodStartDate = existingPeriodStartDate && moment(existingPeriodStartDate).format('YYYY-MM-DD')
    existingPeriodEndDate = existingPeriodEndDate && moment(existingPeriodEndDate).format('YYYY-MM-DD')

    const isStartDateBetween = moment(start_date).isBetween(existingPeriodStartDate, existingPeriodEndDate)
    const isEndDateBetween = moment(end_date).isBetween(existingPeriodStartDate, existingPeriodEndDate)
    const isExistingStartDateBetween = moment(existingPeriodStartDate).isBetween(start_date, end_date)
    const isExistingEndDateBetween = moment(existingPeriodEndDate).isBetween(start_date, end_date)

    if (isStartDateBetween || isEndDateBetween || isExistingStartDateBetween || isExistingEndDateBetween) {
      throw new createHttpError[400]('Contract period already exist with this dates for the contract')
    }
  }

  return { start_date, end_date }
}

async function remove(query) {
  const impact = await db.impact.findOne({ where: { contract_period_id: query.id } })
  if (impact) throw new createHttpError[422]('This contract period cannot be deleted!')
  await db.contractPricing.destroy({ where: { contract_period_id: query.id } })
  const period = await db.contractPeriod.destroy({ where: query })

  return period
}

module.exports = { create, update, remove }
