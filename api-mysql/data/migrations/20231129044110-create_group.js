'use strict';

const { GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(GROUP, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      parent_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: GROUP,
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
      tableName: GROUP,
    });
    await queryInterface.addConstraint(GROUP, {
      fields: ['parent_id'],
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
