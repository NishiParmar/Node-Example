const createHttpError = require('http-errors')
const db = require('../models')

async function list() {
  const units = await db.unit.findAll({
    include: [{
      model: db.unitConversion,
      as: 'unitFrom',
      attributes: ['id'],
      include: [{
        model: db.unit,
        as: 'unitTo',
        attributes: ['id', 'name', 'is_base'],
      }]
    }],
    attributes: ['id', 'name', 'is_base'],
  })

  return units

}

async function findOne(unitId) {
  const unit = await db.unit.findByPk(unitId)

  if (!unit) {
    throw new createHttpError[404]('Unit not found.')
  }

  return unit
}

async function create(payload) {
  const unit = await db.unit.create(payload)

  return unit
}

module.exports = { list, findOne, create }
