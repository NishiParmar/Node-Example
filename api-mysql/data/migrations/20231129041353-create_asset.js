'use strict';

const { ASSET, SITE, PROJECT } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ASSET, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
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
      name: Sequelize.STRING,
      location_gps: {
        type: Sequelize.GEOMETRY('POINT'),
      },
      type: {
        type: Sequelize.ENUM,
        values: ['mobile', 'stationary', 'virtual']
      },
      proportion: Sequelize.STRING,
      project_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: PROJECT,
          },
          key: 'id',
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
      tableName: ASSET,
    });

    await queryInterface.addConstraint(ASSET, {
      fields: ['site_id'],
      type: 'FOREIGN KEY',
      references: {
        table: SITE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(ASSET, {
      fields: ['project_id'],
      type: 'FOREIGN KEY',
      references: {
        table: PROJECT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
