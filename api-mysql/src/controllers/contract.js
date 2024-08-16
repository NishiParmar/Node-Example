const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
  const contract = await db.contract.create(payload)

  return contract
}

async function list() {
  const contract = await db.contract.findAll({
    include: [{ model: db.resource }]
  })

  return contract
}

async function update(query, payload) {
  const contract = await db.contract.update(payload, { where: query })

  return contract
}

async function findOne(contractId) {
  const contract = await db.contract.findByPk(contractId, {
    include: [
      {
        model: db.resource,
        include: [
          { model: db.unit, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
          { model: db.unit, as: 'preferredUnit', attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } }
        ],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      },
      {
        model: db.contractPeriod,
        include: { model: db.contractPricing, attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] } },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
      }
    ],
    order: [
      [db.contractPeriod, 'start_date', 'ASC']
    ],
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
  })

  if (!contract) {
    throw new createHttpError[404]('Contract not found.')
  }

  return contract
}

module.exports = { create, list, findOne, update }
