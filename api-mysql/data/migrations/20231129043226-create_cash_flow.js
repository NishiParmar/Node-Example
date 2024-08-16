'use strict';

const { CASHFLOW, PROJECT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CASHFLOW, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: PROJECT,
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
      tableName: CASHFLOW,
    })
    await queryInterface.addConstraint(CASHFLOW, {
      fields: ['project_id'],
      type: 'FOREIGN KEY',
      references: {
        table: PROJECT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
