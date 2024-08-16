'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // business
    await queryInterface.sequelize.query(
      'insert into business(id, name, created_at, updated_at) \
      select BusinessId, BusinessName, now(), now() from t2xe_platform.business \
      where BusinessId = 56'
    )

    // address
    /*  await queryInterface.sequelize.query(
       'insert into address(street, city, state, state_code, postcode, country, location, created_at, updated_at) \
       select concat_ws(\' \', coalesce(address1, \'\'), coalesce(address2, \'\')), suburb, state, \
       case \
         when state = \'New South Wales\' then \'NSW\' \
         when state = \'South Australia\' then \'SA\' \
         when state = \'Victoria\' then \'VIC\' \
         when state = \'Queensland\' then \'QLD\' \
         when state = \'Tasmania\' then \'TAS\' \
         when state = \'Northern Territory\' then \'NT\' \
         when state = \'Western Australia\' then \'WA\' \
         when state = \'Canberra\' then \'Canberra\' \
       end, \
       postcode, country, ST_GeomFromText(concat(\'POINT(\', lng, \' \', lat, \')\')), now(), now() \
       from t2xe_platform.site'
     ) */

    // site
    await queryInterface.sequelize.query(
      'insert into site(id, name, created_at, updated_at, business_id)'
    )

    /*   await queryInterface.sequelize.query(
        'delete from address where id not in (select address_id from site)'
      ) */
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('address', null, {})
    await queryInterface.bulkDelete('site', null, {})
    await queryInterface.bulkDelete('business', null, {})
  }
}
