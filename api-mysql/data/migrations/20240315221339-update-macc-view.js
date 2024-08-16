'use strict';

const { VIEWS: { MAC_VIEW, CASHFLOW_VIEW, OPPORTUNITY_REDUCTION_VIEW, OPPORTUNITY_LIST_VIEW } } = require('../../src/utils/constants')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('drop view if exists macView')

    await queryInterface.sequelize.query(`drop view if exists ${MAC_VIEW}`)

    await queryInterface.sequelize.query(`create view ${MAC_VIEW} as
      select
        opportunity.opportunity_id,
        opportunity.opportunity_name,
        opportunity.business_id,
        opportunity.cashflow_npv cashflow,
        opportunity.benefit_npv benefit,
        opportunity.npv,
        -opportunity.scope1 / 1000 scope1,
        -opportunity.scope2 / 1000 scope2,
        -opportunity.scope3 / 1000 scope3,
        -- Marginal Abatement Cost (MAC) - Cost per tonne of CO2 reduced
        case
          when opportunity.scope1 + opportunity.scope2 = 0 then 0
          else
            -- NPV - All cost and benefits, discounted to present value
            opportunity.npv
            -- CO2 reduction benefits - Convert CO2 from kg to t
            / ((opportunity.scope1 + opportunity.scope2) / 1000)
        end as mac
      from ${OPPORTUNITY_LIST_VIEW} opportunity
      group by opportunity.business_case_id
   `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`drop view ${MAC_VIEW}`);
  }
};
