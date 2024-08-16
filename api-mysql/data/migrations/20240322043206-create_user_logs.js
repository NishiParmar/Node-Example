'use strict';

const { USER_LOGS } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(USER_LOGS, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      login_id: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: USER_LOGS
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_LOGS);
  }
};
