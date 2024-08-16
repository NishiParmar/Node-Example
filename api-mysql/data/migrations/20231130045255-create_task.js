'use strict';

const { DataTypes } = require('sequelize');
const { TASK, BUSINESS, PROJECT, SITE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(TASK, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      business_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: BUSINESS,
          },
          key: 'id',
        }
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
      site_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: SITE,
          },
          key: 'id',
        }
      },
      status: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      name: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: TASK,
    });

    await queryInterface.addConstraint(TASK, {
      fields: ['business_id'],
      type: 'FOREIGN KEY',
      references: {
        table: BUSINESS,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    await queryInterface.addConstraint(TASK, {
      fields: ['project_id'],
      type: 'FOREIGN KEY',
      references: {
        table: PROJECT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

    await queryInterface.addConstraint(TASK, {
      fields: ['site_id'],
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
