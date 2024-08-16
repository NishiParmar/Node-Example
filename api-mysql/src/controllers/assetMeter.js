const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const assetMeter = await db.assetMeter.create(payload)
  
    return assetMeter
}

async function list() {
    const assetMeterList = await db.assetMeter.findAll()
  
    return assetMeterList
}

async function findOne(assetMeterId) {
    const assetMeter = await db.assetMeter.findByPk(assetMeterId)
  
    if (!assetMeter) {
      throw new createHttpError[404]('Asset-Meter not found.')
    }
  
    return assetMeter
}

async function update (query, payload) {
    const assetMeter = await db.assetMeter.update(payload, {where: query})
    
    return assetMeter
}

module.exports = { create, list, findOne, update }