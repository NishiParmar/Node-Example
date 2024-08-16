'use strict';

const { BUSINESS_CASE, OPPORTUNITY, SCENARIO } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(BUSINESS_CASE, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      opportunity_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: OPPORTUNITY,
          },
          key: 'id',
        }
      },
      scenario_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: SCENARIO,
          },
          key: 'id',
        }
      },
      completion_date: Sequelize.DATEONLY,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: BUSINESS_CASE,
    })
    await queryInterface.addConstraint(BUSINESS_CASE, {
      fields: ['scenario_id'],
      type: 'FOREIGN KEY',
      references: {
        table: SCENARIO,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(BUSINESS_CASE, {
      fields: ['opportunity_id'],
      type: 'FOREIGN KEY',
      references: {
        table: OPPORTUNITY,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
