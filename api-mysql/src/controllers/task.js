const createHttpError = require('http-errors')
const db = require('../models')

async function list(query) {
  let payload = {}
  if (query) {
    payload = { where: { project_id: query.project_id } }
  }
  const tasks = await db.task.findAll({
    ...payload,
    attributes: {
      include: [
        [db.sequelize.literal('( SELECT c.name FROM `contact` AS c INNER JOIN `role` AS r ON r.contact_id = c.id WHERE r.table = \'task\' AND r.item_id = task.id AND r.deleted_at IS NULL AND c.deleted_at IS NULL LIMIT 1 )'), 'contactPerson'],
      ]
    },
    include: [
      {
        model: db.project,
        attributes: ['name']
      }
    ]
  })

  return tasks
}

async function findOne(taskId) {
  const task = await db.task.findByPk(taskId)

  if (!task) {
    throw new createHttpError[404]('Task not found.')
  }

  return task
}

async function create(payload) {
  const task = await db.task.create(payload)

  const role = {
    contact_id: payload.contactId,
    table: 'task',
    item_id: task.id,
    name: 'assigned'
  }
  await db.role.create(role)

  return task
}

async function update(query, payload) {
  const task = await db.task.update(payload, { where: query })

  return task
}

async function remove(query) {
  const task = await db.task.destroy({ where: query })
  await db.role.destroy({ where: { table: 'task', item_id: query.id } })

  return task
}

module.exports = { list, findOne, create, update, remove }
