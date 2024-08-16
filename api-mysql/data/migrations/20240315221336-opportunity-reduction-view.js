'use strict';
const { VIEWS: { OPPORTUNITY_REDUCTION_VIEW } } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW if exists ${OPPORTUNITY_REDUCTION_VIEW}`);

    await queryInterface.sequelize.query(`CREATE VIEW ${OPPORTUNITY_REDUCTION_VIEW} AS
    with discount as (
      select
        value / 100 as rate,
        1 + (value / 100) as multiplier
      from setting
      where setting_name = 'cashDiscountRate'
    )

    select
      opportunity.id as opportunity_id,
      opportunity.name as opportunity_name,
      opportunity.business_id as business_id,
      business_case.id as business_case_id,
      sum(if(reduction.year_offset = 1, reduction.cost, 0)) annual_cost,
      sum(reduction.cost) as cost,
      sum(reduction.cost / pow(discount.multiplier, reduction.year_offset)) as npv,
      sum(coalesce(scope1.value, 0) * reduction.change) scope1,
      sum(coalesce(scope2.value, 0) * reduction.change) scope2,
      sum(coalesce(scope3.value, 0) * reduction.change) scope3
    from
      (discount, opportunity)
    join business_case
      on business_case.opportunity_id = opportunity.id
    join case_impact reduction
      on reduction.business_case_id = business_case.id
      and reduction.deleted_at is null
      and reduction.year_offset <= business_case.economic_life
    join resource
      on reduction.resource_id = resource.id
    left join case_emissions_factor scope1
      on scope1.resource_id = reduction.resource_id
      and scope1.scenario_id = business_case.scenario_id
      and scope1.scope = 1
      and scope1.year_offset = reduction.year_offset
      and (scope1.location_id is null or scope1.location_id = opportunity.location_id)
      and scope1.deleted_at is null
    left join case_emissions_factor scope2
      on scope2.resource_id = reduction.resource_id
      and scope2.scenario_id = business_case.scenario_id
      and scope2.scope = 2
      and scope2.year_offset = reduction.year_offset
      and (scope2.location_id is null or scope2.location_id = opportunity.location_id)
      and scope2.deleted_at is null
    left join case_emissions_factor scope3
      on scope3.resource_id = reduction.resource_id
      and scope3.scenario_id = business_case.scenario_id
      and scope3.scope = 3
      and scope3.year_offset = reduction.year_offset
      and (scope3.location_id is null or scope3.location_id = opportunity.location_id)
      and scope3.deleted_at is null
    where opportunity.deleted_at is null
    group by business_case.id
      `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${OPPORTUNITY_REDUCTION_VIEW}`);
  }
};
