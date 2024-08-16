const db = require('../models')

async function create(payload) {
  const pricing = await db.contractPricing.create(payload)

  return pricing
}

module.exports = { create }
