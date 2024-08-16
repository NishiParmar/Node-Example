const createHttpError = require('http-errors')
const db = require('../models')

async function create(payload) {
    const groupTag = await db.groupTag.create(payload)
  
    return groupTag
}

async function list() {
    const groupTagList = await db.groupTag.findAll()
  
    return groupTagList
}

async function findOne(groupTagId) {
    const groupTag = await db.groupTag.findByPk(groupTagId)
  
    if (!groupTag) {
      throw new createHttpError[404]('Group not found.')
    }
  
    return groupTag
}

async function update (query, payload) {
    const groupTag = await db.groupTag.update(payload, {where: query})
    
    return groupTag
}

module.exports = { create, list, findOne, update }