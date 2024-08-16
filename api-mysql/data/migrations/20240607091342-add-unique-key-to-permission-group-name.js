'use strict';

const { PERMISSION_GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint(PERMISSION_GROUP, {
      fields: ['name'],
      type: 'unique',
      name: 'unique_permission_group_constraint'
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
