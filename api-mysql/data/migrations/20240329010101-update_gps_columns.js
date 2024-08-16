'use strict';

const tableConstants = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // const models = [
    //   tableConstants.ASSET,
    //   tableConstants.LOCATION
    // ]

    // for (let model in models) {
    //   let Model = models[model]

    //   await queryInterface.removeColumn(Model, 'location_gps')

    //   await queryInterface.addColumn(Model, 'location_gps', {
    //     type: Sequelize.GEOMETRY('POINT'),
    //   })
    // }

    await queryInterface.dropTable('location_gps')
  },

  async down(queryInterface, Sequelize) {

  }
};
