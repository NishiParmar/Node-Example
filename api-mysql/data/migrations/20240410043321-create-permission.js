'use strict';

const { PERMISSION_GROUP, PERMISSION, USER } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(PERMISSION, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: USER
          },
          key: 'id'
        }
      },
      permission_group: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: PERMISSION_GROUP
          },
          key: 'id'
        }
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
      tableName: PERMISSION
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(PERMISSION)
  }
};
