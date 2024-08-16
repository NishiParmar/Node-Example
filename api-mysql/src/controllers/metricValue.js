const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const metricValue = await db.metricValue.create(payload)
  
    return metricValue
}

async function list() {
    const metricValueList = await db.metricValue.findAll()
  
    return metricValueList
}

async function findOne(metricValueId) {
    const metricValue = await db.metricValue.findByPk(metricValueId)
  
    if (!metricValue) {
      throw new createHttpError[404]('metricValue not found.')
    }
  
    return metricValue
}

async function update (query, payload) {
    const metricValue = await db.metricValue.update(payload, {where: query})
    
    return metricValue
}

module.exports = { create, list, findOne, update }