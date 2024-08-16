'use strict';

const { OPPORTUNITY, BUSINESS, CASE_EMISSIONS_FACTOR, RESOURCE, CASE_IMPACT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(OPPORTUNITY, 'business_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: BUSINESS
        },
        key: 'id'
      }
    })
    await queryInterface.addConstraint(CASE_EMISSIONS_FACTOR, {
      fields: ['resource_id'],
      type: 'FOREIGN KEY',
      references: {
        table: RESOURCE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(CASE_IMPACT, {
      fields: ['resource_id'],
      type: 'FOREIGN KEY',
      references: {
        table: RESOURCE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) { }
};
