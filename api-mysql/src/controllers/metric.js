const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const metric = await db.metric.create(payload)
  
    return metric
}

async function list() {
    const metricList = await db.metric.findAll()
  
    return metricList
}

async function findOne(metricId) {
    const metric = await db.metric.findByPk(metricId)
  
    if (!metric) {
      throw new createHttpError[404]('metric not found.')
    }
  
    return metric
}

async function update (query, payload) {
    const metric = await db.metric.update(payload, {where: query})
    
    return metric
}

module.exports = { create, list, findOne, update }