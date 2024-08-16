'use strict';

const { TARGET, SCENARIO } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TARGET, {
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
      name: Sequelize.STRING,
      target_date: Sequelize.DATE,
      type: Sequelize.STRING,
      target: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: TARGET,
    });
    await queryInterface.addConstraint(TARGET, {
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
