'use strict';

const { CASE_EMISSIONS_FACTOR, SCENARIO, RESOURCE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CASE_EMISSIONS_FACTOR, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
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
      scope: Sequelize.STRING,
      value: Sequelize.DECIMAL(20, 5),
      resource_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: RESOURCE
          },
          key: 'id'
        }
      },
      start_date: Sequelize.DATEONLY,
      end_date: Sequelize.DATEONLY,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CASE_EMISSIONS_FACTOR,
    });
    await queryInterface.addConstraint(CASE_EMISSIONS_FACTOR, {
      fields: ['scenario_id'],
      type: 'FOREIGN KEY',
      references: {
        table: SCENARIO,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
