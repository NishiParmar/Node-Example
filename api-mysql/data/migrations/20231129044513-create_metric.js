'use strict';

const { METRIC, SITE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(METRIC, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      table: Sequelize.STRING,
      item_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: SITE,
          },
          key: 'id',
        }
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: METRIC,
    });
    await queryInterface.addConstraint(METRIC, {
      fields: ['item_id'],
      type: 'FOREIGN KEY',
      references: {
        table: SITE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
