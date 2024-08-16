'use strict';

const { CONTRACT, RESOURCE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * 
     */
    await queryInterface.createTable(CONTRACT, {
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
      supplier: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: CONTRACT,
    });
    await queryInterface.addConstraint(CONTRACT, {
      fields: ['resource_id'],
      type: 'FOREIGN KEY',
      references: {
        table: RESOURCE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
