'use strict';
const { OPPORTUNITY, SITE, TASK, ROLE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(OPPORTUNITY, 'site_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: SITE
        },
        key: 'id'
      }
    })
    await queryInterface.addConstraint(OPPORTUNITY, {
      fields: ['site_id'],
      type: 'FOREIGN KEY',
      references: {
        table: SITE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(ROLE, {
      fields: ['item_id'],
      type: 'FOREIGN KEY',
      references: {
        table: TASK,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
