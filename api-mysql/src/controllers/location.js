const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    if (payload?.location_gps) {
        const point = db.Sequelize.fn('ST_GeomFromText', 'POINT(' + payload.location_gps.replace(',', ' ') + ')')
        payload = { ...payload, location_gps: point }
    }
    const location = await db.location.create(payload)

    return location
}

async function list() {
    const location = await db.location.findAll()

    return location
}

async function findOne(locationId) {
    const location = await db.location.findByPk(locationId)

    if (!location) {
        throw new createHttpError[404]('location not found')
    }

    return location
}

async function update(query, payload) {
    const location = await db.location.update(payload, { where: query })

    return location
}

module.exports = { create, list, findOne, update }
