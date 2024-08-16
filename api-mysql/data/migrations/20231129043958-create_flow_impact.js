'use strict';

const { FLOW_IMPACT, FLOW } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(FLOW_IMPACT, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      flow_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: FLOW,
          },
          key: 'id',
        }
      },
      cost: Sequelize.DECIMAL(20, 5),
      emissions_scope1: Sequelize.DECIMAL(20, 5),
      emissions_scope2: Sequelize.DECIMAL(20, 5),
      emissions_scope3: Sequelize.DECIMAL(20, 5),
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: FLOW_IMPACT,
    });
    await queryInterface.addConstraint(FLOW_IMPACT, {
      fields: ['flow_id'],
      type: 'FOREIGN KEY',
      references: {
        table: FLOW,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
