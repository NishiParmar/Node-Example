'use strict';

const { SETTING, BUSINESS } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(SETTING, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      setting_name: {
        type: Sequelize.STRING,
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
      title: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.STRING
      },
      suffix: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.TEXT
      },
      options: {
        type: Sequelize.STRING
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: SETTING,
    });

    await queryInterface.addConstraint(SETTING, {
      fields: ['business_id'],
      type: 'FOREIGN KEY',
      references: {
        table: BUSINESS,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
