const WheelService = {
  getAllTires(knex) {
    return knex.select("*").from("inventory_tires");
  },
  getByInvoiceNum(knex, invoiceNum) {
    return knex.from("wheel_repair").select("*").where({ invoice: invoiceNum });
  },
  insertRepair(knex, wRepair) {
    return knex
      .insert(wRepair)
      .into("wheel_repair")
      .returning("*")
      .then((rows) => rows[0]);
  },
  getByDate(knex, pickedDate) {
    return knex.from("wheel_repair").select("*").where({ created: pickedDate });
  },
};

module.exports = WheelService;
