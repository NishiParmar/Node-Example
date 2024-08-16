'use strict';

const { ASSET, METER, ASSET_METER } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ASSET_METER, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      asset_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: ASSET,
          },
          key: 'id',
        }
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
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: ASSET_METER,
    })

    await queryInterface.addConstraint(ASSET_METER, {
      fields: ['asset_id'],
      type: 'FOREIGN KEY',
      references: {
        table: ASSET,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(ASSET_METER, {
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
