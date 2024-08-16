'use strict';

const { GROUP_TAG, GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(GROUP_TAG, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      group_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: GROUP,
          },
          key: 'id',
        }
      },
      table: Sequelize.STRING,
      item_id: Sequelize.INTEGER.UNSIGNED,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: GROUP_TAG,
    });
    await queryInterface.addConstraint(GROUP_TAG, {
      fields: ['group_id'],
      type: 'FOREIGN KEY',
      references: {
        table: GROUP,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
