const createHttpError = require('http-errors')
const db = require('../models')

async function list() {
  const assets = await db.asset.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
  })

  return assets

}

async function findOne(assetId) {
  const asset = await db.asset.findByPk(assetId)

  if (!asset) {
    throw new createHttpError[404]('Asset not found.')
  }

  return asset
}

async function create(payload) {
  if (payload?.location_gps) {
    const point = db.Sequelize.fn('ST_GeomFromText', 'POINT(' + payload.location_gps.replace(',', ' ') + ')')
    payload = { ...payload, location_gps: point }
  }
  const asset = await db.asset.create(payload)

  return asset
}

module.exports = { list, findOne, create }
