'use strict';

const { ROLE, CONTACT, BUSINESS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ROLE, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      contact_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: CONTACT,
          },
          key: 'id',
        }
      },
      table: Sequelize.STRING,
      item_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: BUSINESS,
          },
          key: 'id',
        }
      },
      name: Sequelize.STRING,
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: ROLE,
    });
    await queryInterface.addConstraint(ROLE, {
      fields: ['contact_id'],
      type: 'FOREIGN KEY',
      references: {
        table: CONTACT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
