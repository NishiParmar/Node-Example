'use strict';
const { VIEWS: { REDUCTION_VIEW } } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW if exists ${REDUCTION_VIEW}`);

    await queryInterface.sequelize.query(`CREATE VIEW ${REDUCTION_VIEW} AS
        with discount as (
          select
            value / 100 as rate,
            1 + (value / 100) as multiplier
          from setting
          where setting_name = 'cashDiscountRate'
        )

        select
          years.year_offset,
          opportunity.id as opportunity_id,
          opportunity.name as opportunity_name,
          opportunity.business_id as business_id,
          business_case.id as business_case_id,
          resource.name as resourceTypeName,
          resource.id as resourceTypeId,
          round(reduction.change) as caseImpactChange,
          round((reduction.change * reduction_cost.price)) as cost,
          round((reduction.change * reduction_cost.price) / pow(discount.multiplier, reduction.year_offset)) as npv,
          coalesce(factor.scope1, 0) * reduction.change / 1000 scope1,
          coalesce(factor.scope2, 0) * reduction.change / 1000 scope2,
          coalesce(factor.scope3, 0) * reduction.change / 1000 scope3
        from
          (years, discount, opportunity)
        join business_case
          on business_case.opportunity_id = opportunity.id and business_case.deleted_at IS NULL
        join case_impact reduction
          on reduction.business_case_id = business_case.id
          and reduction.year_offset = years.year_offset
          and reduction.deleted_at IS NULL
        join resource
          on reduction.resource_id = resource.id
          and resource.deleted_at IS NULL
        left join scenario on scenario.id = business_case.scenario_id and scenario.deleted_at IS NULL
        left join case_resource_price reduction_cost on
          reduction_cost.scenario_id = scenario.id 
          and reduction_cost.resource_id = reduction.resource_id 
          and reduction_cost.start_date <= DATE_ADD(scenario.baseline_start_date, INTERVAL reduction.year_offset YEAR) 
          and reduction_cost.end_date >= DATE_ADD(scenario.baseline_start_date, INTERVAL reduction.year_offset YEAR) 
          and reduction_cost.location_id = opportunity.location_id 
          and reduction_cost.deleted_at IS NULL
        left join case_emissions_factor factor
          on factor.resource_id = reduction.resource_id
          and factor.scenario_id = business_case.scenario_id
          and factor.year_offset = reduction.year_offset
          and (factor.location_id is null or factor.location_id = opportunity.location_id)
          and factor.deleted_at is null
        where opportunity.deleted_at is null
        and years.year_offset <= business_case.economic_life
        group by opportunity_id, year_offset, resource.id
      `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${REDUCTION_VIEW}`);
  }
};
