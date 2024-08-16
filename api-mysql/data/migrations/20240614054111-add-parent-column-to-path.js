'use strict';

const { PATH } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(PATH, 'parent_id', {
      type: Sequelize.STRING,
      after: 'path'
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
