'use strict';

const { UNIT_CONVERSION, UNIT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(UNIT_CONVERSION, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      unit_from_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: UNIT,
          },
          key: 'id',
          as: 'unitFrom'
        }
      },
      unit_to_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: UNIT,
          },
          key: 'id',
          as: 'unitTo',
        }
      },
      multiplier: Sequelize.INTEGER,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: UNIT_CONVERSION,
    });
    await queryInterface.addConstraint(UNIT_CONVERSION, {
      fields: ['unit_from_id'],
      type: 'FOREIGN KEY',
      references: {
        table: UNIT,
        field: 'id'
      },
      as: 'unitFrom',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(UNIT_CONVERSION, {
      fields: ['unit_to_id'],
      type: 'FOREIGN KEY',
      references: {
        table: UNIT,
        field: 'id'
      },
      as: 'unitTo',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
