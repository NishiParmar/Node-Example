const db = require('../models')
const { VIEWS: { MAC_VIEW } } = require('../utils/constants')

async function getMacList(body) {
   const [results] = await db.sequelize.query(`SELECT * FROM ${MAC_VIEW}
   WHERE
      business_id = ${body.business_id}
      -- AND year_offset = ${body.yearOffset}
   `)

   return results
}

module.exports = { getMacList }
