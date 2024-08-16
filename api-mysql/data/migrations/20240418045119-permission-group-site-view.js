'use strict';

const { VIEWS: { ALLOWED_SITE_VIEW } } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE VIEW ${ALLOWED_SITE_VIEW} AS
      SELECT
        ROW_NUMBER() OVER(ORDER BY permission_group,id) as row_id,
        site.*,
        permissionGroup.id AS 'permission_group',
        permissionGroup.name AS 'permission_group_name'
      FROM
          permission_group AS permissionGroup
          LEFT OUTER JOIN permission AS permissions ON permissionGroup.id = permissions.permission_group
          AND (
            permissions.deleted_at IS NULL
            AND permissions.table = 'site'
          )
          JOIN site ON permissions.item_id = site.id AND site.deleted_at IS NULL
      WHERE permissionGroup.deleted_at IS NULL
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${ALLOWED_SITE_VIEW}`)
  }
};
