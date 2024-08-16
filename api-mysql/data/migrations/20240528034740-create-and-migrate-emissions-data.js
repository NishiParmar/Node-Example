'use strict';

const { RESOURCE, EMISSIONS_FACTOR, EMISSION } = require('../../src/utils/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let resources
    try {
      [resources] = await queryInterface.sequelize.query('SELECT * FROM `resource` ORDER BY `id`')
    } catch (error) { }

    let emissions_factors
    try {
      [emissions_factors] = await queryInterface.sequelize.query('SELECT `id`,`resource_id`,`emission_id`,`reference_desc`,`location_id` FROM `emissions_factor` GROUP BY `resource_id` ORDER BY `resource_id`')
    } catch (error) { }

    if (resources && resources?.length) {
      for (let resourceIndex = 0; resourceIndex < resources.length; resourceIndex++) {
        const resource = resources[resourceIndex]
        const { id: resourceId, business_id, unit_id } = resource
        const factor = emissions_factors.find((factor) => factor.resource_id == resourceId)

        let emissionQuery = `INSERT INTO ${EMISSION}(business_id, name, unit_id) VALUES(${business_id}, "emission-${resourceIndex + 1}", ${unit_id})`
        if (factor) {
          const { reference_desc } = factor
          emissionQuery = `INSERT INTO ${EMISSION}(business_id, name, description, unit_id) VALUES(${business_id}, "emission-${resourceIndex + 1}", "${reference_desc}", ${unit_id})`
        }

        const [emission_id] = await queryInterface.sequelize.query(emissionQuery)

        if (factor) {
          await queryInterface.sequelize.query(`
          UPDATE ${EMISSIONS_FACTOR}
          SET emission_id = ${emission_id}
          WHERE resource_id = ${resourceId}
          `)
        }

        await queryInterface.sequelize.query(`
        UPDATE ${RESOURCE}
        SET emission_id = ${emission_id}
        WHERE id = ${resourceId}
      `)
      }
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
