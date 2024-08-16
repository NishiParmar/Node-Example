const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const meter = await db.meter.create(payload)

    return meter
}

async function list(resourceId) {
    const meterList = await db.meter.findAll({
        where: { resource_id: resourceId },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    })

    return meterList
}

async function findOne(meterId) {
    const meter = await db.meter.findByPk(meterId)

    if (!meter) {
        throw new createHttpError[404]('meter not found.')
    }

    return meter
}

async function update(query, payload) {
    const meter = await db.meter.update(payload, { where: query })

    return meter
}

module.exports = { create, list, findOne, update }