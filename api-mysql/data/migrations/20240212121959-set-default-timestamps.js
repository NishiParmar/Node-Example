'use strict';

const { VIEWS, ...tableConstants } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { ACCESS_LOGS, ERROR_LOGS, ASSET, BUSINESS, CASHFLOW, CONTACT, FLOW, GROUP, IMPACT, LOCATION, METER, METRIC, PROJECT, RESOURCE, ROLE, SCENARIO, SETTING, SITE, UNIT, USER, OPPORTUNITY, CONTRACT, INDUSTRY, TARGET, TASK, ASSET_METER, BUSINESS_CASE, CASE_CASHFLOW, EMISSIONS_FACTOR, FLOW_IMPACT, GROUP_TAG, UNIT_CONVERSION, CASE_EMISSIONS_FACTOR, CASE_IMPACT, CONTRACT_PERIOD, CONTRACT_PRICING, METRIC_VALUE, BUSINESS_RESOURCE } = tableConstants

    const models = { ASSET, BUSINESS, CASHFLOW, CONTACT, FLOW, GROUP, IMPACT, LOCATION, METER, METRIC, PROJECT, RESOURCE, ROLE, SCENARIO, SETTING, SITE, UNIT, USER, OPPORTUNITY, CONTRACT, INDUSTRY, TARGET, TASK, ASSET_METER, BUSINESS_CASE, CASE_CASHFLOW, EMISSIONS_FACTOR, FLOW_IMPACT, GROUP_TAG, UNIT_CONVERSION, CASE_EMISSIONS_FACTOR, CASE_IMPACT, CONTRACT_PERIOD, CONTRACT_PRICING, METRIC_VALUE, BUSINESS_RESOURCE }

    for (let model in models) {
      let Model = models[model]

      await queryInterface.changeColumn(Model, 'created_at', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      })

      await queryInterface.changeColumn(Model, 'updated_at', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      })
    }

    const logModels = [ACCESS_LOGS, ERROR_LOGS]
    for (let model of logModels) {
      await queryInterface.changeColumn(model, 'created_at', {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      })
    }
  },

  async down(queryInterface, Sequelize) {

  }
};
