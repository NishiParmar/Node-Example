'use strict';

const { BUSINESS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(BUSINESS, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      industry_id: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      main_office_site_id: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: BUSINESS,
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
