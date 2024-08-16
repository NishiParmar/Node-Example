const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const permission = await db.permission.create(payload)

    return permission
}

async function list(payload) {
    const permissionList = await db.permission.findAll()
    
    return permissionList
}

async function findOne(permissionId) {
    const permission = await db.permission.findByPk(permissionId)

    if (!permission) {
        throw new createHttpError[404]('permission not found.')
    }

    return permission
}

async function update(query, payload) {
    const permission = await db.permission.update(payload, { where: query })

    return permission
}

async function remove(query) {
    const permission = await db.permission.destroy({ where: query })

    return permission
}

module.exports = { create, list, findOne, update, remove }