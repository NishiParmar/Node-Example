'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE FUNCTION irr(cashflows TEXT)
    RETURNS DECIMAL(12,8)
    NO SQL
    DETERMINISTIC
      begin
        set @guess = 0.1;
        set @max_iterations = 1000;
        set @tolerance = 0.0000001;
        set @iter = 0;
          REPEAT
              select
                  sum(cashflow / pow(1 + @guess, id - 1)),
                  sum((id - 1) * -1 * cashflow / pow(1 + @guess, id))
                  into
                  @npv,
                  @dnpv
                  from json_table(concat('[', cashflows, ']'), '$[*]' columns (
                      id for ordinality,
                      cashflow decimal(10, 2) path '$'
                  )) cashflow;
              set @guess = @guess - @npv / @dnpv;
              set @iter = @iter + 1;
          until
                  abs(@npv / @dnpv) < @tolerance
                  or @iter > @max_iterations
                  or @guess >= 1024
                  or @guess <= -1024
            end repeat;

          return @guess;
      end
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP FUNCTION irr`)
  }
};
