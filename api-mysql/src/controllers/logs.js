const db = require('../models')

async function create(payload) {
    const log = await db.errorLogs.create(payload)

    return log
}
module.exports = { create }