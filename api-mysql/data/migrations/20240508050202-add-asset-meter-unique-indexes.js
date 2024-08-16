'use strict';

const { ASSET_METER } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint(ASSET_METER, {
      fields: ['asset_id', 'meter_id'],
      type: 'unique',
      name: 'unique_asset_meter_constraint_1'
    });
    await queryInterface.addConstraint(ASSET_METER, {
      fields: ['meter_id', 'asset_id'],
      type: 'unique',
      name: 'unique_asset_meter_constraint_2'
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
