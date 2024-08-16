'use strict';

const fs = require('fs');

const backupFile = 'data/db.sql'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    if (fs.existsSync(backupFile)) {
      const sql_string = fs.readFileSync(backupFile, 'utf8');
      // await queryInterface.sequelize.query(sql_string, {raw: true});
      const sequelize = new Sequelize(
        queryInterface.sequelize.config.database,
        queryInterface.sequelize.config.username,
        queryInterface.sequelize.config.password,
        {
          host: queryInterface.sequelize.config.host,
          dialect: 'mysql',
          dialectOptions: {
            multipleStatements: true
          }
        }
      );
      console.log('sql_string => ', sql_string);
      await sequelize.query(sql_string, { raw: true });
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
