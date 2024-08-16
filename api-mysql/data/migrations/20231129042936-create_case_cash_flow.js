'use strict';

const { CASE_CASHFLOW, BUSINESS_CASE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CASE_CASHFLOW, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      business_case_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: BUSINESS_CASE,
          },
          key: 'id',
        }
      },
      name: Sequelize.STRING,
      year_offset: Sequelize.INTEGER,
      cashflow: Sequelize.STRING,
      type: {
        type: Sequelize.ENUM,
        values: ['CAPEX', 'OPEX', 'BENEFIT']
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CASE_CASHFLOW,
    })
    await queryInterface.addConstraint(CASE_CASHFLOW, {
      fields: ['business_case_id'],
      type: 'FOREIGN KEY',
      references: {
        table: BUSINESS_CASE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
