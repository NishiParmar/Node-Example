'use strict';

const { ACCESS_LOGS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ACCESS_LOGS, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: true
      },
      endpoint: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING
      },
      params: {
        type: Sequelize.JSON
      },
      body: {
        type: Sequelize.JSON
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: ACCESS_LOGS,
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
