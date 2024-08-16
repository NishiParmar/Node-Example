const createHttpError = require('http-errors')
const db = require('../models')
const { getPermissionData } = require('./userPermission')

async function list(query, userDetails) {
  const { business_id } = query
  if (!business_id) throw new createHttpError[422]('please provide valid business_id parameter')

  const siteQuery = { business_id: business_id }
  const data = await getPermissionData(userDetails, 'sites', siteQuery)
  const sites = data?.sites || []

  return sites
}

async function update(query, payload) {
  const site = await db.site.update(payload, { where: query })

  return site
}

module.exports = { list, update }
