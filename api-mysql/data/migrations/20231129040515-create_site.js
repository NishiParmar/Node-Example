'use strict';

const { BUSINESS, LOCATION, SITE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(SITE, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      business_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: BUSINESS,
          },
          key: 'id',
        }
      },
      location_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: LOCATION,
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
      tableName: SITE,
    });
    await queryInterface.addConstraint(SITE, {
      fields: ['business_id'],
      type: 'FOREIGN KEY',
      references: {
        table: BUSINESS,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(SITE, {
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
