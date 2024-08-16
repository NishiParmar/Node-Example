'use strict';
const { EMISSIONS_FACTOR } = require('../../src/utils/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data
    try {
      [data] = await queryInterface.sequelize.query('SELECT * FROM `emissions_factor` ORDER BY `resource_id`, `location_id`, `start_date`, `end_date`, `scope`')
    } catch (error) {}

    if (data && data?.length) {
      const dataArray = []
      let modifiedArray = []
      let duplicateRecords = []
      for (let object of data) {
        let newObj = { ...object }
        for (let property in object) {
          if (object[property] == "") {
            newObj = { ...newObj, [property]: null }
          }
        }
        if (modifiedArray.length > 0) {
          const previousObject = modifiedArray[modifiedArray.length - 1]
          const { id, scope, value, resource_id, start_date, end_date, location_id } = previousObject
          const { id: current_id, scope: current_scope, value: current_value, resource_id: current_resource_id, start_date: current_start_date, end_date: current_end_date, location_id: current_location_id } = newObj
          if (resource_id == current_resource_id && start_date == current_start_date && end_date == current_end_date && location_id == current_location_id) {
            previousObject[`scope${current_scope}`] = current_value
            modifiedArray.pop()
            modifiedArray.push(previousObject)
            duplicateRecords.push(newObj.id)
          } else {
            const modifiedObject = modifiedArray[modifiedArray.length - 1]
            if (modifiedObject.scope) {
              modifiedObject[`scope${modifiedObject.scope}`] = modifiedObject.value
            }
            dataArray.push(modifiedObject)
            modifiedArray = []
            newObj[`scope${newObj.scope}`] = newObj.value
            modifiedArray.push(newObj)
          }
        } else {
          newObj[`scope${newObj.scope}`] = newObj.value
          modifiedArray.push(newObj)
        }
      }
      if (modifiedArray.length) dataArray.push(modifiedArray[modifiedArray.length - 1])
      for (let factor of dataArray) {
        const { id, scope1, scope2, scope3 } = factor
        await queryInterface.sequelize.query(`
        UPDATE ${EMISSIONS_FACTOR} 
        SET scope1 = ${scope1}, scope2 = ${scope2}, scope3= ${scope3}
        WHERE id = ${id}
      `)
      }
      await queryInterface.sequelize.query(`
      UPDATE ${EMISSIONS_FACTOR} 
      SET deleted_at = now()
      WHERE id IN (${duplicateRecords.join(',')})
    `)
    }
  },

  async down(queryInterface, Sequelize) {

  }
};
