const db = require('../models')

async function create(payload) {
  const impact = await db.contact.create(payload)

  return impact
}

async function list(payload) {
  const impact = await db.contact.findAll()

  return impact
}

module.exports = { create, list }
