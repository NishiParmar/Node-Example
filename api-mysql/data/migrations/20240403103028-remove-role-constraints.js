'use strict';

const { ROLE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(ROLE, 'role_ibfk_2')
    await queryInterface.removeConstraint(ROLE, 'role_item_id_task_fk')
  },

  async down(queryInterface, Sequelize) {
  }
};
