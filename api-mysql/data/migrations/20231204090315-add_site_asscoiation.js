'use strict';

const { BUSINESS, INDUSTRY, SITE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(BUSINESS, 'industry_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: INDUSTRY
        },
        key: 'id'
      }
    })

    await queryInterface.changeColumn(BUSINESS, 'main_office_site_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: {
          tableName: SITE
        },
        key: 'id'
      }
    })

    await queryInterface.addConstraint(BUSINESS, {
      fields: ['industry_id'],
      type: 'FOREIGN KEY',
      references: {
        table: INDUSTRY,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(BUSINESS, {
      fields: ['main_office_site_id'],
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
