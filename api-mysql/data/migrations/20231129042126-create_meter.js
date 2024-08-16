'use strict';

const { METER, CONTRACT, RESOURCE } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(METER, {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      name: Sequelize.STRING,
      contract_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references: {
          model: {
            tableName: CONTRACT,
          },
          key: 'id',
        }
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
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
      deleted_at: Sequelize.DATE,

    }, {
      timestamps: true,
      paranoid: true,
      underscored: true,
      tableName: METER,
    });
    await queryInterface.addConstraint(METER, {
      fields: ['resource_id'],
      type: 'FOREIGN KEY',
      references: {
        table: RESOURCE,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    await queryInterface.addConstraint(METER, {
      fields: ['contract_id'],
      type: 'FOREIGN KEY',
      references: {
        table: CONTRACT,
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {

  }
};
