const { sequelize } = require('../models')

async function get() {
  await sequelize.authenticate()

  return { message: 'database connection successfully established' }
}

module.exports = { get } 
