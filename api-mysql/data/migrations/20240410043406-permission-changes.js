'use strict';

const { PERMISSION_GROUP, PERMISSION } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS permission_group_business_1`)
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS permission_group_business_2`)
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS permission_group_business_3`)
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS permission_group_site_1`)
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS permission_group_site_2`)
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS permission_group_site_3`)
    await queryInterface.removeColumn(PERMISSION_GROUP, 'business_unit')
    await queryInterface.removeColumn(PERMISSION_GROUP, 'sites')
    await queryInterface.removeColumn(PERMISSION_GROUP, 'sections')
    await queryInterface.removeConstraint(PERMISSION, 'permission_ibfk_1')
    await queryInterface.removeColumn(PERMISSION, 'user_id')
    await queryInterface.addColumn(PERMISSION, 'table', {
      type: Sequelize.STRING,
      after: 'id'
    })
    await queryInterface.addColumn(PERMISSION, 'item_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      after: 'table'
    })
  },

  async down(queryInterface, Sequelize) {

  }
};
