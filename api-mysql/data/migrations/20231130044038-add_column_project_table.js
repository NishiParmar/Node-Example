'use strict';

const { PROJECT, BUSINESS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(PROJECT, 'business_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: BUSINESS,
        },
        key: 'id',
      }
    })

    await queryInterface.addConstraint(PROJECT, {
      fields: ['business_id'],
      type: 'FOREIGN KEY',
      references: {
        table: BUSINESS,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) { }
};
