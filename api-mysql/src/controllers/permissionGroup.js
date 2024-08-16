const db = require('../models')

async function list() {
    let permissionGroupList = await db.permissionGroup.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [{
            model: db.permission,
            as: 'business_permissions',
            where: { table: 'business' },
            attributes: ['id', 'table', 'item_id'],
            required: false
        }, {
            model: db.permission,
            where: { table: 'site' },
            attributes: ['id', 'table', 'item_id'],
            as: 'site_permissions',
            required: false
        }, {
            model: db.permissionGroupPath,
            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
            include: [{
                model: db.path,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                include: [{
                    model: db.path,
                    as: 'parent_path',
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                }],
            }],
            as: 'allowed_paths',
            required: false
        }]
    })
    permissionGroupList = JSON.parse(JSON.stringify(permissionGroupList))

    const permissionGroups = []
    for (let groupIndex = 0; groupIndex < permissionGroupList.length; groupIndex++) {
        const permissionGroup = permissionGroupList[groupIndex]
        const permissionData = await getPermissionGroupAllowedData(permissionGroup)
        permissionGroups.push(permissionData)
    }

    return permissionGroups
}

async function getPermissionGroupAllowedData(permissionGroup) {
    const { business_permissions, site_permissions } = permissionGroup

    const businessIdArr = business_permissions.map(business => business.item_id)
    const siteIdArr = site_permissions.map(site => site.item_id)

    const siteIncludeObject = {
        model: db.site,
        as: 'mainSite',
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    }

    let businesses = await db.business.findAll({
        where: { id: { [db.Sequelize.Op.in]: businessIdArr } },
        include: [siteIncludeObject],
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
    })
    businesses = JSON.parse(JSON.stringify(businesses))

    if (site_permissions.length) {
        for (let business of businesses) {
            const sites = business.mainSite
            let filteredSites = sites.filter(site => (siteIdArr.includes(site.id)))
            if (filteredSites.length <= 0) {
                filteredSites = business.mainSite
            }
            business['mainSite'] = filteredSites
        }
    }

    for (let businessObj of business_permissions) {
        const business = businesses.find(business => business.id == businessObj.item_id)
        businessObj['name'] = business?.name
    }

    const allowedSites = []
    for (let business of businesses) {
        const sites = business.mainSite
        for (let site of sites) {
            const { id, name, business_id } = site // original site objects of site table
            let siteObject = {}
            if (siteIdArr.includes(id)) {
                const site = site_permissions.find(site => site.item_id == id)
                siteObject = { ...site, business_id, name }
            } else {
                siteObject = { table: 'site', item_id: site.id, name, business_id }
            }
            allowedSites.push(siteObject)
        }
    }
    permissionGroup['site_permissions'] = allowedSites

    return permissionGroup
}

module.exports = { list }