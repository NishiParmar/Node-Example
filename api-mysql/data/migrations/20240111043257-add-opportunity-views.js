'use strict';
const { VIEWS: viewConstants } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE VIEW ${viewConstants.REDUCTION_VIEW} AS WITH recursive years AS (
          SELECT
            0 year_offset
          UNION ALL
          SELECT
            year_offset + 1
          FROM
            years
          WHERE
            year_offset < 10
        )
        SELECT
          years.year_offset,
          opportunity.id AS opportunity_id,
          opportunity.name AS opportunity_name,
          opportunity.business_id AS business_id,
          resource.name AS resourceTypeName,
          resource.id AS resourceTypeId,
          SUM(reduction.change) AS caseImpactChange,
          IF(unit_conversion.multiplier > 0,SUM(COALESCE(scope1.value, 0)) * (reduction.change / unit_conversion.multiplier), SUM(COALESCE(scope1.value, 0)) * (reduction.change / 1)) scope1,
          IF(unit_conversion.multiplier > 0,SUM(COALESCE(scope2.value, 0)) * (reduction.change / unit_conversion.multiplier), SUM(COALESCE(scope2.value, 0)) * (reduction.change / 1)) scope2,
          IF(unit_conversion.multiplier > 0,SUM(COALESCE(scope3.value, 0)) * (reduction.change / unit_conversion.multiplier), SUM(COALESCE(scope3.value, 0)) * (reduction.change / 1)) scope3
        FROM
          (years, opportunity)
          JOIN business_case b_case ON b_case.opportunity_id = opportunity.id
          JOIN case_impact reduction ON reduction.business_case_id = b_case.id AND reduction.year_offset = years.year_offset
          JOIN resource ON reduction.resource_id = resource.id
          LEFT JOIN case_emissions_factor scope1 ON resource.id = scope1.resource_id AND scope1.scope = 1
          LEFT JOIN case_emissions_factor scope2 ON resource.id = scope2.resource_id AND scope2.scope = 2
          LEFT JOIN case_emissions_factor scope3 ON resource.id = scope3.resource_id AND scope3.scope = 3
          LEFT JOIN unit_conversion ON resource.unit_id = unit_conversion.unit_from_id AND resource.preferred_unit = unit_conversion.unit_to_id
        WHERE opportunity.deleted_at IS NULL
        GROUP BY opportunity_id, year_offset, resourceTypeId
        ORDER BY opportunity_id, year_offset
      `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${viewConstants.REDUCTION_VIEW}`);
  }
};
