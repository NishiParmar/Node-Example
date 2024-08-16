'use strict';

const { VIEWS: { ALLOWED_SITE_VIEW } } = require('../../src/utils/constants');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query(`DROP VIEW IF EXISTS ${ALLOWED_SITE_VIEW}`)

      await queryInterface.sequelize.query(`CREATE VIEW ${ALLOWED_SITE_VIEW} AS
      SELECT
        ROW_NUMBER() OVER(ORDER BY permissionGroup.id,user_id,id) as row_id,
        tbl.*,
        userPermissionGroup.user_id AS user_id,
        permissionGroup.name AS 'permission_group_name'
      FROM
          permission_user AS userPermissionGroup
          LEFT OUTER JOIN permission_group AS permissionGroup 
          ON userPermissionGroup.permission_group = permissionGroup.id AND permissionGroup.deleted_at IS NULL
          JOIN(select
                  allowed_business.permission_group AS permission_group,
                  site.*,
                  if(count(allowed_sites.id) over (partition by business.id) > 0, allowed_sites.id is not null, 1) allowed
                  from permission allowed_business
                  join business
                  on business.id = allowed_business.item_id and business.deleted_at IS NULL
                  join site
                  on site.business_id = business.id
                  left join permission allowed_sites
                  on allowed_sites.table = 'site'
                  and allowed_sites.item_id = site.id
                  and allowed_sites.permission_group = allowed_business.permission_group
                  where allowed_business.table = 'business' and allowed_business.deleted_at IS NULL
                  order by permission_group, id) as tbl
          ON permissionGroup.id = tbl.permission_group
      WHERE userPermissionGroup.deleted_at IS NULL
    `)
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  },

  async down(queryInterface, Sequelize) {

  }
};
