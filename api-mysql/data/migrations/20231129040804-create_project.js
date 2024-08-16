'use strict';

const { PROJECT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(PROJECT, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      parent_id: Sequelize.INTEGER.UNSIGNED,
      name: Sequelize.STRING,
      status: Sequelize.STRING,
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      economic_life: Sequelize.INTEGER.UNSIGNED,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: PROJECT,
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
