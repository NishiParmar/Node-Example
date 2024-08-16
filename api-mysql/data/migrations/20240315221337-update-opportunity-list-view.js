'use strict';
const { VIEWS: { OPPORTUNITY_LIST_VIEW, OPPORTUNITY_REDUCTION_VIEW, OPPORTUNITY_CASHFLOW_VIEW } } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP VIEW if exists opportunityListViews');
    await queryInterface.sequelize.query(`DROP VIEW if exists ${OPPORTUNITY_LIST_VIEW}`);

    await queryInterface.sequelize.query(`CREATE VIEW ${OPPORTUNITY_LIST_VIEW} AS
    select
      opportunity.id as opportunity_id,
      opportunity.name as opportunity_name,
      opportunity.business_id,
      opportunity.site_id,
      site.name as siteName,
      business_case.economic_life,
      business_case.id AS business_case_id,
      business_case.start_date,
      business_case.completion_date,
      scenario.name as scenario_name,
      (SELECT group_type.type 
        FROM group_tag AS tag INNER JOIN \`group\` AS group_type ON group_type.id = tag.group_id
        WHERE group_type.name = 'Opportunity Type' AND tag.item_id = opportunity.id AND tag.table = 'opportunity' AND group_type.deleted_at IS NULL AND tag.deleted_at IS NULL LIMIT 1) AS projectType,
      (SELECT group_tech.type 
        FROM group_tag AS tag INNER JOIN \`group\` AS group_tech ON group_tech.id = tag.group_id 
        WHERE group_tech.name = 'Opportunity Technology' AND tag.item_id = opportunity.id AND tag.table = 'opportunity' AND group_tech.deleted_at IS NULL AND tag.deleted_at IS NULL LIMIT 1) AS projectTechnology,
      coalesce(cashflow.capex, 0) capex,
      coalesce(cashflow.opex, 0) opex,
      coalesce(cashflow.other_cost, 0) otherCost,
      coalesce(cashflow.cashflow, 0) cashflow,
      round(coalesce(cashflow.npv, 0)) AS cashflow_npv,
      -round(coalesce(reduction.cost, 0)) benefit,
      -round(coalesce(reduction.npv, 0)) benefit_npv,
      round(coalesce(cashflow.npv, 0) - coalesce(reduction.npv, 0)) npv,
      coalesce(reduction.annual_cost, 0) AS netAnnualSaving,
      coalesce(reduction.scope1, 0) / 1000 scope1,
      coalesce(reduction.scope2, 0) / 1000 scope2,
      coalesce(reduction.scope3, 0) / 1000 scope3,
      (coalesce(reduction.scope1, 0) + coalesce(reduction.scope2, 0) + coalesce(reduction.scope3, 0)) / 1000 as total_reduction,
      -- TODO: Needs per year list of cashflow and reductions merged
      irr((SELECT GROUP_CONCAT(cc) AS cashflows 
            FROM (  SELECT SUM(coalesce(cc.cashflow, 0)) AS cc
                    FROM case_cashflow cc JOIN business_case b_case 
                    ON b_case.opportunity_id = opportunity.id AND cc.business_case_id = b_case.id 
                    GROUP BY cc.year_offset) as cc ) 
      ) as irr
    from opportunity
    join business_case
      on business_case.opportunity_id = opportunity.id
      and business_case.deleted_at is null
    join scenario
      on scenario.id = business_case.scenario_id
      and scenario.deleted_at is null
    left join site
      on opportunity.site_id = site.id
      and site.deleted_at is null
    left join ${OPPORTUNITY_CASHFLOW_VIEW} cashflow
      on cashflow.business_case_id = business_case.id
    left join ${OPPORTUNITY_REDUCTION_VIEW} reduction
      on reduction.business_case_id = business_case.id
    where opportunity.deleted_at is null
    group by business_case.id
    order by opportunity.id
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${OPPORTUNITY_LIST_VIEW}`)
  }
};
