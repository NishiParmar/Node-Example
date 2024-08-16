'use strict';

const { VIEWS: { ALLOWED_SITE_VIEW } } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW IF EXISTS ${ALLOWED_SITE_VIEW}`)

    await queryInterface.sequelize.query(`CREATE VIEW ${ALLOWED_SITE_VIEW} AS
      SELECT
        ROW_NUMBER() OVER(ORDER BY permissionGroup.id,user_id,id) as row_id,
        site.*,
        userPermissionGroup.user_id AS user_id,
        permissionGroup.id AS 'permission_group',
        permissionGroup.name AS 'permission_group_name'
      FROM
          permission_user AS userPermissionGroup
            LEFT OUTER JOIN permission_group AS permissionGroup 
              ON userPermissionGroup.permission_group = permissionGroup.id AND permissionGroup.deleted_at IS NULL
            LEFT OUTER JOIN permission AS permissions 
              ON permissionGroup.id = permissions.permission_group
              AND (
                permissions.deleted_at IS NULL
                AND permissions.table = 'site'
              )
            JOIN site ON permissions.item_id = site.id AND site.deleted_at IS NULL
      WHERE userPermissionGroup.deleted_at IS NULL
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP VIEW ${ALLOWED_SITE_VIEW}`)
  }
};
