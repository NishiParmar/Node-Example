'use strict';

const { EMISSIONS_FACTOR, RESOURCE, LOCATION } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(EMISSIONS_FACTOR, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      resource_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: RESOURCE,
          },
          key: 'id',
        }
      },
      scope: Sequelize.STRING,
      value: Sequelize.INTEGER,
      reference_desc: Sequelize.STRING,
      location_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: LOCATION,
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
      tableName: EMISSIONS_FACTOR,
    });
    await queryInterface.addConstraint(EMISSIONS_FACTOR, {
      fields: ['resource_id'],
      type: 'FOREIGN KEY',
      references: {
        table: RESOURCE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(EMISSIONS_FACTOR, {
      fields: ['location_id'],
      type: 'FOREIGN KEY',
      references: {
        table: LOCATION,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
