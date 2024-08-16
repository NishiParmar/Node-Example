'use strict';
const fs = require('fs')
const path = require('path')
const { convertCsvToJson } = require('../../src/helpers/convertToJson')
const { VIEWS, ...tableConstants } = require('../../src/utils/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // emptying the existing data from all the tables
    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0`)
    for (let model in tableConstants) {
      await queryInterface.bulkDelete(tableConstants[model], null, {})
    }
    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`)

    // seeding the data into tables
    const files = {}
    fs.readdirSync(path.join(__dirname, './csv-files'))
      .filter(filename => {
        return (
          filename.indexOf('.') !== 0 &&
          filename.slice(-4) === '.csv'
        )
      })
      .forEach((file) => {
        const fileData = fs.readFileSync(path.join(__dirname, '/csv-files/', file))
        let modelName = file.trim().split('.')[0].toUpperCase()
        files[modelName] = fileData
      })

    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0`)
    for (let file in files) {
      const data = await convertCsvToJson({ data: files[file] })

      // processing the csv data to set null in the empty("") values
      const dataArray = []
      for (let object of data) {
        let newObj = { ...object }
        for (let property in object) {
          if (object[property] == "") {
            newObj = { ...newObj, [property]: null }
          } else {
            if (property == 'location_gps') {
              const point = Sequelize.fn('ST_GeomFromText', 'POINT(' + object[property].replace(',', ' ') + ')')
              newObj = { ...newObj, [property]: point }
            }
          }
        }
        dataArray.push(newObj)
      }
      await queryInterface.bulkInsert(tableConstants[file], dataArray)
      // await queryInterface.bulkInsert(tableConstants[file], data)
    }
    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 0`)
    for (let model in tableConstants) {
      await queryInterface.bulkDelete(tableConstants[model], null, {})
    }
    await queryInterface.sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`)
  }
};
