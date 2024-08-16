'use strict';

const { BUSINESS, INDUSTRY, SITE, LOCATION, LOCATION_GPS, METRIC, METRIC_VALUE, OPPORTUNITY, SCENARIO, TARGET, CASE_CASHFLOW, BUSINESS_CASE, CASE_IMPACT, CASE_EMISSIONS_FACTOR, RESOURCE, UNIT } = require('../../src/utils/constants')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(INDUSTRY, [
      {
        id: 4400,
        name: 'Accommodation	Hotels',
        industryDesc: 'Hotels, Motels, Resorts, Caravan Parks, Camp Grounds',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6711,
        name: 'Residential Property Operators',
        industryDesc: 'Residential Property Rentals and Leasing',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6712,
        name: 'Commerical Property Rentals and Leasing',
        industryDesc: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(LOCATION_GPS, [
      {
        lat: '-34.9251941627941',
        long: '138.594557444400',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        lat: '-34.8526490352967',
        long: '138.478700740755',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        lat: '-12.4282886373961',
        long: '130.900256053982',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(LOCATION, [
      {
        address: '60 Light Square',
        city: 'Adelaide',
        state: 'South Australia',
        postcode: '5000',
        location_gps: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        address: '349 Military Road',
        city: 'Semaphore Park',
        state: 'South Australia',
        postcode: '5019',
        location_gps: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        address: '11 Farrell Crescent',
        city: 'Winnellie',
        state: 'Northern Territory',
        postcode: '0820',
        location_gps: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
    
    await queryInterface.bulkInsert(BUSINESS, [
      {
        name: 'GDAY Group',
        industry_id: 4400,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Discovery Holiday Parks',
        industry_id: 4400,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'GDAY Parks',
        industry_id: 4400,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(SITE, [
      {
        name: 'Head Office',
        business_id: 1,
        location_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Adelaide Beachfront',
        business_id: 2,
        location_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Darwin',
        business_id: 2,
        location_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(METRIC, [
      {
        name: 'Nights Sold',
        table: 'Site',
        item_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nights Sold',
        table: 'Site',
        item_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(METRIC_VALUE, [
      {
        metric_id: 1,
        value: '3568',
        start_date: '1/1/2022',
        end_date: '31/1/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 1,
        value: '3185',
        start_date: '1/2/2022',
        end_date: '28/2/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 1,
        value: '3543',
        start_date: '1/3/2022',
        end_date: '31/3/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 1,
        value: '3389',
        start_date: '1/4/2022',
        end_date: '30/4/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 1,
        value: '3257',
        start_date: '1/5/2022',
        end_date: '31/5/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 1,
        value: '2977',
        start_date: '1/6/2022',
        end_date: '30/6/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 1,
        value: '3026',
        start_date: '1/7/2022',
        end_date: '31/7/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '1837',
        start_date: '1/1/2022',
        end_date: '31/1/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '1708',
        start_date: '1/2/2022',
        end_date: '28/2/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '2139',
        start_date: '1/3/2022',
        end_date: '31/3/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '3026',
        start_date: '1/4/2022',
        end_date: '30/4/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '5743',
        start_date: '1/5/2022',
        end_date: '31/5/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '7572',
        start_date: '1/6/2022',
        end_date: '30/6/2022',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        metric_id: 2,
        value: '8094',
        start_date: '1/7/2022',
        end_date: '31/7/2022',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(OPPORTUNITY, [
      {
        name: 'ABF Pool Heating',
        description: 'Pool heating electrification',
        business_id: 1,
        site_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'ABF EV Transition',
        description: 'EV Ute',
        business_id: 1,
        site_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'ABF Waste',
        description: 'Waste segregation',
        business_id: 1,
        site_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'Darwin Hot Water',
        description: 'Waste segregation',
        business_id: 2,
        site_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'Darwin HVAC',
        description: 'Aircon upgrade & controls',
        business_id: 2,
        site_id: 3,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(SCENARIO, [
      {
        name: 'ABF Scenario',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Darwin Scenario',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'ABF+Darwin Scenario',
        created_at: new Date(),
        updated_at: new Date()
      },
    ])

    await queryInterface.bulkInsert(BUSINESS_CASE, [
      {
        opportunity_id: 1,
        scenario_id: 1,
        completion_date: '31/12/2026',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        opportunity_id: 1,
        scenario_id: 3,
        completion_date: '31/12/2026',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        opportunity_id: 2,
        scenario_id: 1,
        completion_date: '31/12/2026',
        created_at: new Date(),
        updated_at: new Date()
      },
    ])

    await queryInterface.bulkInsert(TARGET, [
      {
        scenario_id: 1,
        name: 'ABF Target',
        target_date: '1/1/2035',
        type: 'Emissions',
        target: '500',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        scenario_id: 2,
        name: 'Darwin Target',
        target_date: '1/1/2035',
        type: 'Emissions',
        target: '500',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        scenario_id: 3,
        name: 'ABF+Darwin Target',
        target_date: '1/1/2035',
        type: 'Emissions',
        target: '800',
        created_at: new Date(),
        updated_at: new Date()
      },
    ])

    await queryInterface.bulkInsert(CASE_CASHFLOW, [
      {
        business_case_id: 1,
        name: 'ABF CAPEX',
        year_offset: '0',
        cashflow: '20800',
        type: 'capex',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '1',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '2',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '3',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '4',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '5',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '6',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '7',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        business_case_id: 1,
        name: 'ABF Elec Saving',
        year_offset: '8',
        cashflow: '-10332',
        type: 'benefit',
        created_at: new Date(),
        updated_at: new Date()
      },
    ])

    await queryInterface.bulkInsert(UNIT, [
      {
        name: 'kWh',
        is_base: 0,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'MWh',
        is_base: 0,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'W',
        is_base: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(RESOURCE, [
      {
        name: 'Electricity OS',
        class: 'New Zealand',
        sub_class: '',
        unit_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      }, {
        name: 'Diesel',
        class: 'Transport',
        sub_class: '',
        unit_id: 2,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(CASE_IMPACT, [
      {
        business_case_id: 1,
        year_offset: '0',
        resource_id: 1,
        change: 18,
        cost: 45,
        created_at: new Date(),
        updated_at: new Date()
      }
    ])

    await queryInterface.bulkInsert(CASE_EMISSIONS_FACTOR, [
      {
        resource_id: 2,
        scope: 2,
        value: 200.56,
        resource_id: 1,
        year_offset: 0,
        start_date: '1/7/2023',
        end_date: '30/6/2024',
        created_at: new Date(),
        updated_at: new Date()
      }, {
        resource_id: 2,
        scope: 3,
        value: 23.87,
        resource_id: 1,
        year_offset: 0,
        start_date: '1/7/2023',
        end_date: '30/6/2024',
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down(queryInterface, Sequelize) {

  }
};
