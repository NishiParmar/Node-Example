'use strict';
const { VIEWS: viewConstants } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE VIEW ${viewConstants.OPPORTUNITY_LIST_VIEW} AS 
    SELECT 
      id, 
      (SELECT businessCase.economic_life 
        FROM business_case AS businessCase INNER JOIN opportunity AS opp ON businessCase.opportunity_id = opp.id 
        WHERE opp.id = opportunity.id LIMIT 1) AS economic_life,
      (SELECT businessCase.id 
          FROM business_case AS businessCase INNER JOIN opportunity AS opp ON businessCase.opportunity_id = opp.id 
          WHERE opp.id = opportunity.id LIMIT 1) AS businessCaseId,
      (SELECT businessCase.start_date
        FROM business_case AS businessCase INNER JOIN opportunity AS opp ON businessCase.opportunity_id = opp.id
        WHERE opp.id = opportunity.id LIMIT 1) AS start_date,
      (SELECT businessCase.completion_date
        FROM business_case AS businessCase INNER JOIN opportunity AS opp ON businessCase.opportunity_id = opp.id
        WHERE opp.id = opportunity.id LIMIT 1) AS completion_date, 
      (SELECT g.type 
        FROM group_tag AS tag INNER JOIN \`group\` AS g ON g.id = tag.group_id 
        WHERE g.name = 'Opportunity Type' AND tag.item_id = opportunity.id AND tag.table = 'opportunity' LIMIT 1) AS projectType,
      (SELECT g.type 
        FROM group_tag AS tag INNER JOIN \`group\` AS g ON g.id = tag.group_id 
        WHERE g.name = 'Opportunity Technology' AND tag.item_id = opportunity.id AND tag.table = 'opportunity' LIMIT 1) AS projectTechnology,
      (SELECT SUM(cc.cashflow) 
        FROM case_cashflow cc JOIN business_case b_case ON b_case.opportunity_id = opportunity.id
        WHERE cc.business_case_id = b_case.id AND cc.type LIKE '%CAPEX%') AS capex, 
      (SELECT SUM(cc.cashflow) 
        FROM case_cashflow cc JOIN business_case b_case ON b_case.opportunity_id = opportunity.id
        WHERE cc.business_case_id = b_case.id AND cc.type LIKE '%OPEX%') AS opex, 
      (SELECT SUM(cc.cashflow) 
        FROM case_cashflow cc JOIN business_case b_case ON b_case.opportunity_id = opportunity.id
        WHERE cc.business_case_id = b_case.id AND cc.type NOT LIKE '%OPEX%' AND cc.type NOT LIKE '%CAPEX%') AS otherCost, 
      irr((SELECT GROUP_CONCAT(cc.cashflow) FROM case_cashflow cc JOIN business_case b_case ON b_case.opportunity_id = opportunity.id AND cc.business_case_id = b_case.id)) AS irr, 
      (SELECT (SELECT SUM(ci.cost / POW(s.value, ci.year_offset)) 
        FROM case_impact ci JOIN setting s ON s.setting_name = 'cashDiscountRate'
        JOIN business_case bc ON bc.id = ci.business_case_id AND bc.opportunity_id = opportunity.id) - (SELECT SUM(ci.cashflow / POW(s.value, ci.year_offset)) FROM case_cashflow ci JOIN setting s ON s.setting_name = 'cashDiscountRate' JOIN business_case bc ON bc.id = ci.business_case_id AND bc.opportunity_id = opportunity.id) FROM dual) AS npv, 
      (SELECT SUM(ci.change) FROM case_impact ci JOIN business_case b_case ON b_case.id = ci.business_case_id AND b_case.opportunity_id = opportunity.id AND ci.year_offset = 1) AS netAnnualSaving 
    FROM opportunity AS opportunity 
    WHERE (opportunity.deleted_at IS NULL)
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${viewConstants.OPPORTUNITY_LIST_VIEW}`)
  }
};
