'use strict';

const { INDUSTRY } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(INDUSTRY, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      industryDesc: Sequelize.STRING,
      parent_industry: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: INDUSTRY,
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
      tableName: INDUSTRY,
    });
    await queryInterface.addConstraint(INDUSTRY, {
      fields: ['parent_industry'],
      type: 'FOREIGN KEY',
      references: {
        table: INDUSTRY,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
