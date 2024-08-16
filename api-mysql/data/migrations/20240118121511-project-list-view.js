'use strict';
const { VIEWS: viewConstants } = require('../../src/utils/constants');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE VIEW ${viewConstants.PROJECT_LIST_VIEW} AS
    SELECT
        id AS project_id,
        (SELECT g.type FROM group_tag AS tag INNER JOIN \`group\` AS g ON g.id = tag.group_id WHERE g.name = 'Project Type' AND tag.item_id = project.id AND tag.table = 'project' LIMIT 1) AS projectType,
        (SELECT g.type FROM group_tag AS tag INNER JOIN \`group\` AS g ON g.id = tag.group_id WHERE g.name = 'Project Technology' AND tag.item_id = project.id AND tag.table = 'project' LIMIT 1) AS projectTechnology, 
        (SELECT SUM(cashflow) FROM cashflow WHERE project_id = project.id AND cashflow.type = "CAPEX") AS capex, 
        (SELECT SUM(cashflow) FROM cashflow WHERE project_id = project.id AND cashflow.type = "OPEX" AND cashflow.year_offset = 1) AS opex,
        (SELECT SUM(cashflow) FROM cashflow WHERE project_id = project.id AND cashflow.type != "OPEX" AND cashflow.type != "CAPEX") AS otherCost, 
        (SELECT SUM(impact.change) FROM impact WHERE project_id = project.id) AS reduction, 
        irr((SELECT GROUP_CONCAT(cashflow) FROM cashflow WHERE project_id = project.id)) AS irr, 
        (SELECT CAST(SUM(COALESCE(scope1.value, 0) + COALESCE(scope2.value, 0) + COALESCE(scope3.value, 0)) as decimal(44,5)) 
            FROM project
              LEFT JOIN impact ON impact.project_id = project.id
              LEFT JOIN contract_period ON impact.contract_period_id = contract_period.id
              LEFT JOIN contract_pricing ON contract_pricing.contract_period_id = contract_period.id
              LEFT JOIN contract ON contract_period.contract_id = contract.id
              LEFT JOIN resource ON contract.resource_id = resource.id
              LEFT JOIN emissions_factor scope1 ON
              resource.id = scope1.resource_id AND scope1.scope = 1
              LEFT JOIN emissions_factor scope2 ON
              resource.id = scope2.resource_id AND scope2.scope = 2
              LEFT JOIN emissions_factor scope3 ON
              resource.id = scope3.resource_id AND scope3.scope = 3) 
            AS totalReduction,
        (SELECT COALESCE(tbl2.price, 0) * COALESCE(tbl2.cost, 0) - COALESCE(tbl1.opexCost,0) AS netAnnualSavings 
            FROM (
                  (SELECT SUM(cashflow) AS opexCost 
                    FROM cashflow 
                    WHERE project_id = project.id AND cashflow.type = "OPEX" AND cashflow.year_offset = 1 ) AS tbl1,
                  (SELECT price AS price, f.cost AS cost 
                    FROM contract_period cp JOIN impact ON cp.id = impact.contract_period_id
                        LEFT JOIN contract_pricing c_pricing ON c_pricing.contract_period_id = cp.id
                        LEFT JOIN contract c ON c.id = cp.contract_id
                        LEFT JOIN resource r ON r.id = c.resource_id
                        LEFT JOIN meter m ON m.resource_id = r.id
                        LEFT JOIN flow f ON f.meter_id = m.id
                    WHERE impact.project_id = project.id AND impact.year_offset = 1  LIMIT 1) AS tbl2 )) 
            AS netAnnualSaving 
      FROM project AS project 
      WHERE (project.deleted_at IS NULL)
    `)

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${viewConstants.PROJECT_LIST_VIEW}`)
  }
};