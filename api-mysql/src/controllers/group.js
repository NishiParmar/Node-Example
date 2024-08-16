const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const group = await db.group.create(payload)
  
    return group
}

async function list() {
    const groupList = await db.group.findAll()
  
    return groupList
}

async function findOne(groupId) {
    const group = await db.group.findByPk(groupId)
  
    if (!group) {
      throw new createHttpError[404]('Group not found.')
    }
  
    return group
}

async function update (query, payload) {
    const group = await db.group.update(payload, {where: query})
    
    return group
}

module.exports = { create, list, findOne, update }