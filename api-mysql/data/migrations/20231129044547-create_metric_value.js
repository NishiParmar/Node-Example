'use strict';

const { METRIC_VALUE, METRIC } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(METRIC_VALUE, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      metric_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: METRIC,
          },
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      value: Sequelize.DECIMAL(20, 5),
      start_date: Sequelize.DATE,
      end_date: Sequelize.DATE,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: METRIC_VALUE,
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
