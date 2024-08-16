'use strict';
const { VIEWS: { OPPORTUNITY_CASHFLOW_VIEW } } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP VIEW if exists opportunityListViews');
    await queryInterface.sequelize.query(`DROP VIEW if exists ${OPPORTUNITY_CASHFLOW_VIEW}`);

    await queryInterface.sequelize.query(`CREATE VIEW ${OPPORTUNITY_CASHFLOW_VIEW} AS
    with discount as (
      select
        value / 100 as rate,
        1 + (value / 100) as multiplier
      from setting
      where setting_name = 'cashDiscountRate'
    )

    select
      opportunity.id opportunity_id,
      business_case.id AS business_case_id,
      sum(if(cashflow.type = 'CAPEX', cashflow.cashflow, 0)) AS capex,
      sum(if(cashflow.type = 'OPEX', cashflow.cashflow, 0)) AS opex,
      sum(if(cashflow.type = 'OTHER', cashflow.cashflow, 0)) AS other_cost,
      sum(cashflow.cashflow) AS cashflow,
      sum(cashflow.cashflow / pow(discount.multiplier, cashflow.year_offset)) AS npv
    from (opportunity, discount)
    join business_case
      on business_case.opportunity_id = opportunity.id
    left join case_cashflow cashflow
      on cashflow.business_case_id = business_case.id
    where opportunity.deleted_at is null
    group by business_case.id
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${OPPORTUNITY_CASHFLOW_VIEW}`)
  }
};
