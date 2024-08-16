'use strict';

const { CONTRACT_PRICING, CONTRACT_PERIOD } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CONTRACT_PRICING, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      contract_period_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: CONTRACT_PERIOD,
          },
          key: 'id',
        }
      },
      time_of_day: Sequelize.TIME,
      price: Sequelize.DECIMAL(20, 5),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CONTRACT_PRICING,
    });
    await queryInterface.addConstraint(CONTRACT_PRICING, {
      fields: ['contract_period_id'],
      type: 'FOREIGN KEY',
      references: {
        table: CONTRACT_PERIOD,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
