'use strict';

const { VIEWS: { MAC_VIEW } } = require('../../src/utils/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   async up(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`CREATE VIEW ${MAC_VIEW} AS WITH recursive years AS (
         SELECT
            0 year_offset
         UNION ALL
            SELECT year_offset + 1
            FROM years
            WHERE year_offset < 30
         ),
         discount AS(
            SELECT VALUE / 100 AS rate,
            1 + ( VALUE / 100 ) AS multiplier
         FROM setting
         WHERE setting_name = 'cashDiscountRate'
         )
         SELECT
            years.year_offset,
            opportunity.id AS opportunity_id,
            opportunity.name AS opportunity_name,
            scenario.name AS scenario_name,
            opportunity.business_id,
            opportunity.site_id,
            site.name AS siteName,
            SUM(COALESCE(reduction.cost, 0)) AS cost,
            SUM(COALESCE(cost_opex.cashflow, 0)) AS opex_cashflow,
            SUM(COALESCE(cost_capex.cashflow, 0)) AS capex_cashflow,
            SUM(COALESCE(scope1.value, 0)) AS scope1,
            SUM(COALESCE(scope2.value, 0)) AS scope2,
            SUM(COALESCE(scope3.value, 0)) AS scope3,
            IF(
               SUM( COALESCE(scope1.value, 0) + COALESCE(scope2.value, 0) ) = 0,
               0,
               SUM(
                  (reduction.cost - cost_opex.cashflow) / POW(discount.multiplier, years.year_offset) - cost_capex.cashflow) / 
                  SUM(IF(reduction.year_offset = 1, 
                     (COALESCE(scope1.value, 0) + COALESCE(scope2.value, 0)) * reduction.change, 0
                  )
                  ) / 1000
            ) AS mac,
            SUM(COALESCE(scope1.value, 0) + COALESCE(scope2.value, 0) + COALESCE(scope3.value, 0)) AS totalReduction
         FROM
            (years, discount, opportunity)
         JOIN business_case ON business_case.opportunity_id = opportunity.id AND business_case.deleted_at IS NULL
         LEFT JOIN site ON opportunity.site_id = site.id AND site.deleted_at IS NULL
         JOIN scenario ON scenario.id = business_case.scenario_id AND scenario.deleted_at IS NULL
         LEFT JOIN case_cashflow cost_opex ON
            cost_opex.business_case_id = business_case.id AND cost_opex.year_offset = years.year_offset AND cost_opex.type = 'OPEX' AND cost_opex.deleted_at IS NULL
         LEFT JOIN case_cashflow cost_capex ON
            cost_capex.business_case_id = business_case.id AND cost_capex.year_offset = years.year_offset AND cost_capex.type = 'CAPEX' AND cost_capex.deleted_at IS NULL
         LEFT JOIN case_impact reduction ON
            reduction.business_case_id = business_case.id AND reduction.year_offset = years.year_offset AND reduction.deleted_at IS NULL
         LEFT JOIN case_emissions_factor scope1 ON
            scope1.resource_id = reduction.resource_id AND scope1.scenario_id = scenario.id AND scope1.scope = 1 AND scope1.year_offset = reduction.year_offset AND scope1.deleted_at IS NULL
         LEFT JOIN case_emissions_factor scope2 ON
            scope2.resource_id = reduction.resource_id AND scope2.scenario_id = scenario.id AND scope2.scope = 2 AND scope2.year_offset = reduction.year_offset AND scope2.deleted_at IS NULL
         LEFT JOIN case_emissions_factor scope3 ON
            scope3.resource_id = reduction.resource_id AND scope2.scenario_id = business_case.scenario_id AND scope3.scope = 3 AND scope3.year_offset = reduction.year_offset AND scope3.deleted_at IS NULL
         WHERE
            opportunity.deleted_at IS NULL AND years.year_offset < business_case.economic_life
         GROUP BY
            opportunity.id,
            years.year_offset
         ORDER BY
            opportunity.id;
   `);
   },

   async down(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`DROP VIEW ${MAC_VIEW}`);
   }
};