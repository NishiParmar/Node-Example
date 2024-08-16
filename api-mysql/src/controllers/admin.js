const createHttpError = require('http-errors')
const db = require('../models')
const { ROLES, REQUIRED_PATHS } = require('../utils/codeConstants')

async function getUserGroup(userDetails) {
    const email = userDetails?.email
    if (!email) throw new createHttpError[400]('user email not provided!')

    let user = await db.user.findOne({
        where: { email: email },
        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
        include: [{
            model: db.permissionUser,
            attributes: ['id', 'user_id'],
            include: [{
                model: db.permissionGroup,
                attributes: ['id', 'name'],
            }]
        }]
    })

    const userGroup = user?.permissionUser?.permissionGroup?.name

    return userGroup
}

async function assign(payload) {
    const { user_id, group_id } = payload
    if (!user_id || !group_id) throw new createHttpError[422]('please provide valid user and group details!')

    const existingPermission = await db.permissionUser.findOne({ where: { user_id } })
    let user
    if (existingPermission) {
        user = await db.permissionUser.update({ permission_group: group_id }, { where: { user_id } })
    } else {
        user = await db.permissionUser.create({ user_id, permission_group: group_id })
    }

    return user
}

async function updatePermissionGroup(payload) {
    const { permission_group, name, allowed_paths, businesses } = payload
    if (!permission_group || !parseInt(permission_group)) throw new createHttpError[422]('please provide permission_group to be updated!')
    const permissionGroup = await db.permissionGroup.findByPk(permission_group, { raw: true })
    if (!permissionGroup) throw new createHttpError[404]('permission group not found!')
    if (name) await db.permissionGroup.update({ name }, { where: { id: permission_group, name: { [db.Sequelize.Op.not]: ROLES.ADMIN } } })

    if (allowed_paths && allowed_paths?.length) {
        const allowedPathArr = [...new Set(allowed_paths)]

        const existingPathPermissions = await db.permissionGroupPath.findAll({ where: { permission_group }, attributes: ['id', 'permission_group', 'path_id'], raw: true })
        const existingPathPermissionsArr = existingPathPermissions.map(path => path.path_id)

        let newPaths = [], removedPaths = []
        for (let pathId of allowedPathArr) {
            const isExistingPathPermission = existingPathPermissionsArr.includes(pathId)
            if (!isExistingPathPermission) {
                newPaths.push(pathId)
            }
        }

        for (let pathId of existingPathPermissionsArr) {
            const isRemovedPermission = allowedPathArr.includes(pathId)
            if (!isRemovedPermission) {
                removedPaths.push(pathId)
            }
        }

        const removePermissionGroupPathFilter = { permission_group, path_id: { [db.Sequelize.Op.in]: removedPaths } }
        if (permissionGroup.name == ROLES.ADMIN) {
            const { SETTING, MANAGE_USER } = REQUIRED_PATHS
            const pathFilter = { path: { [db.Sequelize.Op.in]: [SETTING, MANAGE_USER] } }
            const requiredPaths = await db.path.findAll({ where: pathFilter, attributes: ['id'], raw: true })
            const requiredPathIds = requiredPaths.map(path => path.id)

            const requiredPathFilter = { permission_group, path_id: { [db.Sequelize.Op.in]: requiredPathIds } }
            const existingRequiredPaths = await db.permissionGroupPath.findAll({ where: requiredPathFilter, attributes: ['id', 'path_id', 'permission_group'], raw: true })
            const isRequiredPathsExists = existingRequiredPaths.map(path => path.path_id)

            if (isRequiredPathsExists.length > 0) {
                if (requiredPathIds.length != isRequiredPathsExists.length) {
                    for (let requiredPathId of requiredPathIds) {
                        if (!(isRequiredPathsExists.includes(requiredPathId))) {
                            newPaths.push(requiredPathId)
                        }
                    }
                } else {
                    newPaths = newPaths.filter(id => !(requiredPathIds.includes(id)))
                }
                removedPaths = removedPaths.filter(id => !(requiredPathIds.includes(id)))

                removePermissionGroupPathFilter['path_id'] = { [db.Sequelize.Op.and]: [{ [db.Sequelize.Op.in]: removedPaths }, { [db.Sequelize.Op.notIn]: requiredPathIds }] }
            } else {
                newPaths.push(...requiredPathIds)
            }
        }
        const allowedPaths = newPaths.map(path_id => {
            return { permission_group, path_id }
        })
        await db.permissionGroupPath.destroy({ where: removePermissionGroupPathFilter, force: true })
        await db.permissionGroupPath.bulkCreate(allowedPaths)
    }

    const existingPermissions = await db.permission.findAll({ where: { permission_group }, attributes: ['id', 'table', 'item_id', 'permission_group'], raw: true })

    if (businesses && businesses?.length) {
        const permissions = []
        for (let businessIndex = 0; businessIndex < businesses.length; businessIndex++) {
            const businessObject = businesses[businessIndex]
            const { business_id, sites } = businessObject
            if (!business_id) throw new createHttpError[422]('please provide valid business_id!')
            const permissionObject = { table: 'business', item_id: business_id, permission_group }
            permissions.push(permissionObject)
            if (sites && sites?.length) {
                for (let site_id of sites) {
                    const permissionObject = { table: 'site', item_id: site_id, permission_group }
                    permissions.push(permissionObject)
                }
            }
        }

        const newPermissions = [], removedPermissions = []
        for (let permission of permissions) {
            const { table, item_id, permission_group } = permission
            const isExistingPermission = existingPermissions.find((permission) => (permission.table == table && permission.item_id == item_id && permission.permission_group == permission_group))
            if (!isExistingPermission) {
                newPermissions.push(permission)
            }
        }

        for (let existingPermission of existingPermissions) {
            const { table, item_id, permission_group } = existingPermission
            const isRemovedPermission = permissions.find((permission) => (permission.table == table && permission.item_id == item_id && permission.permission_group == permission_group))
            if (!isRemovedPermission) {
                removedPermissions.push(existingPermission)
            }
        }

        const createdPermissions = await db.permission.bulkCreate(newPermissions)

        const removePermissionIds = removedPermissions.map((permission) => permission.id)
        await db.permission.destroy({ where: { id: { [db.Sequelize.Op.in]: removePermissionIds } }, force: true })

        return { permission_group, createdPermissions, removedPermissions: removePermissionIds }
    }

    return { message: 'Permission group updated successfully' }
}

async function businessList() {
    const businesses = await db.business.findAll({
        attributes: ['id', 'name']
    })

    return businesses
}

async function siteList(businesses) {
    const sites = await db.site.findAll({
        where: { business_id: { [db.Sequelize.Op.in]: businesses } },
        raw: true,
        attributes: ['id', 'name', 'business_id']
    })

    return sites
}

async function createPermissionGroup(payload) {
    const { name, allowed_paths, businesses } = payload
    if (!name) throw new createHttpError[422]('please assign a valid name to the permission_group to be created!')
    const permissionGroupObject = { name }
    const permissionGroup = await db.permissionGroup.create(permissionGroupObject)
    const permission_group = permissionGroup.id

    if (allowed_paths && allowed_paths?.length) {
        const allowedPathArr = [...new Set(allowed_paths)]
        const allowedPaths = allowedPathArr.map(path_id => {
            return { permission_group, path_id }
        })
        await db.permissionGroupPath.bulkCreate(allowedPaths)
    }

    if (businesses && businesses?.length) {
        const permissions = []
        for (let businessIndex = 0; businessIndex < businesses.length; businessIndex++) {
            const businessObject = businesses[businessIndex]
            const { business_id, sites } = businessObject
            if (!business_id) throw new createHttpError[422]('please provide valid business_id!')
            const permissionObject = { table: 'business', item_id: business_id, permission_group }
            permissions.push(permissionObject)
            if (sites && sites?.length) {
                for (let site_id of sites) {
                    const permissionObject = { table: 'site', item_id: site_id, permission_group }
                    permissions.push(permissionObject)
                }
            }
        }
        await db.permission.bulkCreate(permissions)
    }

    return { message: 'Permission group added successfully' }

}

module.exports = { assign, getUserGroup, businessList, siteList, updatePermissionGroup, createPermissionGroup }
