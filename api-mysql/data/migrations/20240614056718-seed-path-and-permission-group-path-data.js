'use strict';

const { PERMISSION_GROUP_PATH, PATH, PERMISSION_GROUP } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      const [[groupCount]] = await queryInterface.sequelize.query(`SELECT COUNT(*) AS count FROM ${PERMISSION_GROUP} WHERE deleted_at IS NULL`)
      if (groupCount?.count > 0) {

        await queryInterface.sequelize.query(`DELETE FROM ${PERMISSION_GROUP_PATH}`)
        await queryInterface.sequelize.query(`DELETE FROM ${PATH}`)

        await queryInterface.sequelize.query(`
          INSERT INTO ${PATH} (id, name, path, parent_id) VALUES
            (1, 'Profile', '/profile', NULL),
            (2, 'Manual Entry', '/profile/flow', '1'),
            (3, 'Import Flow', '/profile/import-flow', '1'),
            (4, 'Perform', '/perform', NULL),
            (5, 'Plan', '/plan', NULL),
            (6, 'Projects', '/plan/projects', '5'),
            (7, 'Opportunities', '/plan/opportunities', '5'),
            (8, 'Action Plan', '/plan/actions', '5'),
            (9, 'ForeCasting', '/plan/forecasting',	'5'),
            (10, 'Settings', '/settings',	NULL),
            (11, 'Target', '/settings/target', '10'),
            (12, 'Economic Metrics', '/settings/economic-metrics', '10'),
            (13, 'Dashboards', '/settings/dashboards',	'10'),
            (14, 'Contracts', '/settings/contracts', '10'),
            (15, 'Resource Types', '/settings/resource-types', '10'),
            (16, 'Users Management', '/settings/users', '10'),
            (17, 'Business Settings', '/settings/businessSettings', '10'),
            (18, 'Report', '/report', NULL);
        `)

        await queryInterface.sequelize.query(`
          INSERT INTO ${PERMISSION_GROUP_PATH} (id, permission_group, path_id) VALUES
            (1, 1, 1),
            (2,	1, 2),
            (3,	1, 3),
            (4,	1, 4),
            (5,	1, 5),
            (6,	1, 6),
            (7,	1, 7),
            (8,	1, 8),
            (9,	1, 9),
            (10, 1,	10),
            (11, 1,	11),
            (12, 1,	12),
            (13, 1,	13),
            (14, 1,	14),
            (15, 1,	15),
            (16, 1,	16),
            (17, 1,	17),
            (18, 1,	18),
            (19, 2,	1),
            (20, 2,	10),
            (21, 2,	17),
            (22, 3,	1),
            (23, 3,	5),
            (24, 3,	6),
            (25, 3,	7),
            (26, 3,	8),
            (27, 3,	9),
            (28, 3,	10),
            (29, 3,	11),
            (30, 3,	12),
            (31, 3,	14),
            (32, 3,	17);
        `)
      }
    } catch (error) {
      console.log('error => ', error);
      throw new Error(error)
    }
  },

  async down(queryInterface, Sequelize) {
  }
};
