'use strict';

const { LOCATION } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(LOCATION, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      address: Sequelize.STRING,
      city: Sequelize.STRING,
      state: Sequelize.STRING,
      postcode: Sequelize.BIGINT,
      location_gps: {
        type: Sequelize.GEOMETRY('POINT'),
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: LOCATION,
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
