'use strict';

const { PROJECT, OPPORTUNITY, IMPACT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(PROJECT, 'description', {
      type: Sequelize.STRING,
    })
    // await queryInterface.addColumn(OPPORTUNITY, 'select', {
    //   type: Sequelize.STRING,
    // })
  },

  async down(queryInterface, Sequelize) {
  }
};
