'use strict';

const { LOCATION } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex(LOCATION, {
      fields: ['state', 'address'],
      name: 'location_index'
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
