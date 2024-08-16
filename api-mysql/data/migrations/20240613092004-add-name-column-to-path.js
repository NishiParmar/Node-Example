'use strict';

const { PATH } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.addColumn(PATH, 'name', {
        type: Sequelize.STRING,
        allowNull: false,
        after: 'id'
      })
    } catch (error) {
      throw new Error(error)
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
