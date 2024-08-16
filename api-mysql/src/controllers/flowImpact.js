const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const flowImpact = await db.flowImpact.create(payload)
  
    return flowImpact
}

async function list() {
    const flowImpactList = await db.flowImpact.findAll()
  
    return flowImpactList
}

async function findOne(flowImpactId) {
    const flowImpact = await db.flowImpact.findByPk(flowImpactId)
  
    if (!flowImpact) {
      throw new createHttpError[404]('flowImpact not found.')
    }
  
    return flowImpact
}

async function update (query, payload) {
    const flowImpact = await db.flowImpact.update(payload, {where: query})
    
    return flowImpact
}

module.exports = { create, list, findOne, update }