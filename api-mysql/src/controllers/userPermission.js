const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    if (!payload.email) throw new createHttpError[400]('user email not provided!')
    const userQuery = { email: payload.email }
    let user = await db.user.findOne({ where: userQuery })
    if (!user) {
        user = await db.user.create(payload)
        let permissionGroup = await db.permissionGroup.findOne({ where: { name: 'Monitoring' }, attributes: ['id'], raw: true })
        let permissionObject = { user_id: user.id, permission_group: permissionGroup?.id }
        await db.permissionUser.create(permissionObject)
    }
    const permissionData = await getPermissionData(userQuery)
    const permissionGroup = permissionData?.permissionUser?.permissionGroup || {}

    return permissionGroup
}

async function getPermissionData(userDetails, allowedList, query, returnType) {
    const email = userDetails?.email
    if (!email) throw new createHttpError[400]('user email not provided!')

    let userInclude = [{
        model: db.permissionUser,
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [{
            model: db.permissionGroup,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        }]
    }]
    if (allowedList == 'businesses') {
        let businessIncludeObject = {
            model: db.AllowedBusinessView,
            as: 'businesses',
            attributes: ['id', 'name', 'industry_id', 'main_office_site_id'],
            include: [{
                model: db.AllowedSiteView,
                as: 'mainSite',
                attributes: ['id', 'name', 'business_id', 'location_id'],
                include: [{
                    model: db.location
                }]
            }]
        }
        userInclude.push(businessIncludeObject)
    } else if (allowedList == 'sites') {
        let siteIncludeObject = {
            model: db.AllowedSiteView,
            as: 'sites',
            where: { allowed: 1 },
            attributes: ['id', 'name', 'business_id', 'location_id', 'allowed'],
            include: [{
                model: db.AllowedBusinessView,
                attributes: ['name'],
                as: 'business'
            }],
        }
        if (query) {
            siteIncludeObject['where'] = { ...siteIncludeObject['where'], ...query }
            siteIncludeObject['required'] = false
        } else {
            siteIncludeObject['where'] = {}
        }
        userInclude.push(siteIncludeObject)
    }

    if (!allowedList && !query && !returnType) {
        userInclude[0].include[0]['include'] = [{
            model: db.permissionGroupPath,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [{
                model: db.path,
                attributes: ['id', 'path']
            }],
            as: 'allowed_paths',
            required: false
        }]
    }

    let user = await db.user.findOne({
        where: { email: email },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [...userInclude]
    })

    user = JSON.parse(JSON.stringify(user))
    if (!allowedList && !user || !user?.permissionUser?.permissionGroup) throw new createHttpError[403]('user does not have valid permissions')

    if (allowedList == 'businesses' && returnType == 'permittedBusinessesArray') {
        if (user?.businesses?.length) {
            const businessIdArray = user.businesses.map(business => business.id)
            user['businesses'] = businessIdArray
        }
    }

    if (allowedList == 'sites' && !(user?.sites?.length)) {
        let siteIncludeObject = {
            model: db.AllowedSiteView,
            as: 'sites',
            where: { allowed: 0 },
            attributes: ['id', 'name', 'business_id', 'location_id', 'allowed'],
            include: [{
                model: db.AllowedBusinessView,
                attributes: ['name'],
                as: 'business'
            }],
        }
        if (query) {
            siteIncludeObject['where'] = { ...siteIncludeObject['where'], ...query }
            siteIncludeObject['required'] = false
        }
        userInclude.push(siteIncludeObject)

        user = await db.user.findOne({
            where: { email: email },
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [...userInclude]
        })
        user = JSON.parse(JSON.stringify(user))
    }

    if (allowedList == 'sites') {
        if (returnType == 'permittedSitesArray') {
            if (user?.sites?.length) {
                const sites = user.sites
                const permittedSitesArray = sites.map(site => site.id)
                user['sites'] = permittedSitesArray
            }
        } else if (!query && returnType == 'allPermittedSitesPerBusinesses') {
            if (user?.sites?.length) {
                const sites = user.sites
                const businessIdArray = sites.map(site => site.business_id)
                const uniqueBusinessIds = [...new Set(businessIdArray)]
                const allowedSites = []
                for (let businessId of uniqueBusinessIds) {
                    const businessSites = sites.filter(site => site.business_id == businessId)
                    if (businessSites?.length) {
                        const filteredSites = businessSites.filter(site => site.business_id == businessId && site.allowed == 1)
                        if (!filteredSites?.length) {
                            const filteredSites = businessSites.filter(site => site.business_id == businessId && site.allowed == 0)
                            allowedSites.push(...filteredSites)
                        } else allowedSites.push(...filteredSites)
                    }
                }
                const permittedSitesArray = allowedSites.map(site => site.id)
                user['sites'] = permittedSitesArray
            }
        }
    }

    return user
}

async function getPermittedDataArrays(userDetails, models, businessId) {
    const email = userDetails?.email
    if (!email) throw new createHttpError[400]('user email not provided!')
    let returnObject = {}
    if (Array.isArray(models)) {
        if (models.includes('businesses')) {
            const [businesses] = await db.sequelize.query(`SELECT GROUP_CONCAT(id) as businessArray FROM vw_allowed_business WHERE user_id = (SELECT id from user WHERE email = '${email}')`)
            const businessArray = businesses[0].businessArray?.split(',')?.map(Number) || []
            returnObject = { ...returnObject, businessArray }
        }
        if (models.includes('sites')) {
            let sites
            if (businessId) {
                [sites] = await db.sequelize.query(`SELECT GROUP_CONCAT(id) as siteArray FROM vw_allowed_site WHERE user_id = (SELECT id from user WHERE email = '${email}') AND business_id = ${businessId}`)
            } else {
                [sites] = await db.sequelize.query(`SELECT GROUP_CONCAT(id) as siteArray FROM vw_allowed_site WHERE user_id = (SELECT id from user WHERE email = '${email}')`)
            }
            const siteArray = sites[0].siteArray?.split(',')?.map(Number) || []
            returnObject = { ...returnObject, siteArray }
        }
    }

    return returnObject
}

module.exports = { create, getPermissionData, getPermittedDataArrays }
