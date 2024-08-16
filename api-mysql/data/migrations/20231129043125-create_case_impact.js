'use strict';

const { CASE_IMPACT, BUSINESS_CASE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(CASE_IMPACT, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      business_case_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: BUSINESS_CASE,
          },
          key: 'id',
        }
      },
      year_offset: Sequelize.INTEGER,
      resource_id: Sequelize.INTEGER.UNSIGNED,
      change: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CASE_IMPACT,
    })
    await queryInterface.addConstraint(CASE_IMPACT, {
      fields: ['business_case_id'],
      type: 'FOREIGN KEY',
      references: {
        table: BUSINESS_CASE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
