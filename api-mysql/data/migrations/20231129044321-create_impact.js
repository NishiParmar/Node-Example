'use strict';

const { IMPACT, PROJECT, CONTRACT_PERIOD, ASSET } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(IMPACT, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: PROJECT,
          },
          key: 'id',
        }
      },
      contract_period_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: CONTRACT_PERIOD,
          },
          key: 'id',
        }
      },
      year_offset: Sequelize.INTEGER,
      change: Sequelize.STRING,
      asset_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: ASSET,
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
      tableName: IMPACT,
    });
    await queryInterface.addConstraint('impact', {
      fields: ['project_id'],
      type: 'FOREIGN KEY',
      references: {
        table: PROJECT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('impact', {
      fields: ['contract_period_id'],
      type: 'FOREIGN KEY',
      references: {
        table: CONTRACT_PERIOD,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint('impact', {
      fields: ['asset_id'],
      type: 'FOREIGN KEY',
      references: {
        table: ASSET,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(IMPACT)
  }
};
