'use strict';

const { PERMISSION_GROUP_PATH, PERMISSION_GROUP, PATH } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(PERMISSION_GROUP_PATH, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      permission_group: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: PERMISSION_GROUP,
          }
        },
        key: 'id',
        allowNull: false
      },
      path_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: PATH,
          }
        },
        key: 'id',
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: PERMISSION_GROUP_PATH
    })
  },

  async down(queryInterface, Sequelize) {
  }
};
