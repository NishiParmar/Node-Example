'use strict';

const { FLOW, METER } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(FLOW, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      meter_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: METER,
          },
          key: 'id',
        }
      },
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      value: Sequelize.DECIMAL(20,5),
      cost: Sequelize.DECIMAL(20,5),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: FLOW,
    });
    await queryInterface.addConstraint(FLOW, {
      fields: ['meter_id'],
      type: 'FOREIGN KEY',
      references: {
        table: METER,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
