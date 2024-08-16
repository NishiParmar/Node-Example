'use strict';

const { OPPORTUNITY } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(OPPORTUNITY, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      parent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
      },
      name: Sequelize.STRING,
      description: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: OPPORTUNITY,
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
