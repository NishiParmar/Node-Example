'use strict';

const { RESOURCE, UNIT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(RESOURCE, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      class: Sequelize.STRING,
      sub_class: Sequelize.STRING,
      unit_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: UNIT,
          },
          key: 'id',
        }
      },
      preferred_unit: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: UNIT,
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
      tableName: RESOURCE,
    });
    await queryInterface.addConstraint(RESOURCE, {
      fields: ['unit_id'],
      type: 'FOREIGN KEY',
      references: {
        table: UNIT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
