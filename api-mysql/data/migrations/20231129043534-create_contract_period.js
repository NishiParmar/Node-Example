'use strict';

const { CONTRACT_PERIOD, CONTRACT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CONTRACT_PERIOD, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      contract_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: CONTRACT,
          },
          key: 'id',
        }
      },
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      projected: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CONTRACT_PERIOD,
    });
    await queryInterface.addConstraint(CONTRACT_PERIOD, {
      fields: ['contract_id'],
      type: 'FOREIGN KEY',
      references: {
        table: CONTRACT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
