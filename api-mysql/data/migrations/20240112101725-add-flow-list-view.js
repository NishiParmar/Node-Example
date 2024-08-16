'use strict';
const { VIEWS: viewConstants } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`CREATE VIEW ${viewConstants.FLOW_VIEW} AS
            SELECT
                business.id as business_id,
                business.name business_name,
                site.name site_name,
                asset.name asset_name,
                meter.name meter_name,
                resource.name resource_name,
                resource.class,
                resource.sub_class,
                flow.value,
                flow.cost,
                scope1.value * flow.value scope1,
                scope2.value * flow.value scope2,
                scope3.value * flow.value scope3,
                flow.start_date period
            FROM flow
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
                left join emissions_factor scope1
                on scope1.resource_id = resource.id
                and flow.start_date between scope1.start_date and scope1.end_date
                and scope1.scope = 1
                left join emissions_factor scope2
                on scope2.resource_id = resource.id
                and flow.start_date between scope2.start_date and scope2.end_date
                and scope2.scope = 2
                left join emissions_factor scope3
                on scope3.resource_id = resource.id
                and flow.start_date between scope3.start_date and scope3.end_date
                and scope3.scope = 3
    `)
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(`DROP VIEW ${viewConstants.FLOW_VIEW}`)
    }
};
