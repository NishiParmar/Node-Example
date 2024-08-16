'use strict';

const { VIEWS: { FLOW_VIEW } } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS ${FLOW_VIEW}`)

    await queryInterface.sequelize.query(`CREATE VIEW ${FLOW_VIEW} AS
      select
        flow.id,
        business.id business_id,
        business.name business_name,
        site.id site_id,
        site.name site_name,
        asset.name asset_name,
        meter.name meter_name,
        resource.id resource_id,
        resource.name resource_name,
        resource.class class,
        resource.sub_class sub_class,
        flow.start_date period,
        flow.value value,
        unit_from.name metric,
        unit_to.name to_metric,
        coalesce(uc.multiplier, 1) multiplier,
        flow.value * (coalesce(factor.scope1, 0) + coalesce(factor.scope2, 0) + coalesce(factor.scope3, 0)) / 1000 / 1000 tco2,
        flow.cost cost,
        flow.value * coalesce(factor.scope1, 0) scope1,
        flow.value * coalesce(factor.scope2, 0) scope2,
        flow.value * coalesce(factor.scope3, 0) scope3
      from flow
      join meter
        on meter.id = flow.meter_id
      join asset_meter
        on asset_meter.meter_id = meter.id
      join asset
        on asset.id = asset_meter.asset_id
      join site 
        on site.id = asset.site_id
      join business
        on business.id = site.business_id
      join resource
        on resource.id = meter.resource_id
      left join emission
        on emission.id = resource.emission_id
      join unit unit_from 
        on unit_from.id = resource.unit_id
      join unit unit_to 
        on unit_to.id = resource.preferred_unit
      join location
        on location.id = site.location_id
      left join location state
        on state.state = location.state
        and state.address is null
      left join unit_conversion uc
        on uc.unit_from_id = unit_from.id
        and uc.unit_to_id = unit_to.id
      left join emissions_factor factor
        on factor.emission_id = emission.id
        and flow.start_date between coalesce(factor.start_date, now() - interval 20 year) and coalesce(factor.end_date - interval 1 minute, now())
        and coalesce(factor.location_id, state.id) = state.id
        and factor.deleted_at IS NULL
      order by flow.id
    `)
  },

  async down(queryInterface, Sequelize) {

  }
};