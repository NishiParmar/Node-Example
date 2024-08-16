const createHttpError = require('http-errors')
const db = require('../models')

async function list(query) {
  let payload = {}
  if (query) {
    payload = { where: { business_id: query.business_id } }
  }
  const settings = await db.setting.findAll(payload)

  return settings
}

async function findOne(payload) {
  const setting = await db.setting.findOne({ where: payload })

  if (!setting) {
    throw new createHttpError[404]('Setting not found.')
  }

  return setting
}

async function create(payload) {
  const setting = await db.setting.create(payload)

  return setting
}

async function update(query, payload) {
  const setting = await db.setting.update(payload, { where: query })

  return setting
}

module.exports = { list, findOne, create, update }
