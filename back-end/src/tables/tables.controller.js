const e = require("cors");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service")
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  res.json({
    data: await service.list(),
  });
}

async function tableExists(req,res,next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id)
  if (foundTable) {
      res.locals.table = foundTable
      return next();
  };
  return next({
      status: 404,
      message: `Table does not exist: ${table_id}`
  });
}

async function reservationExists(req,res,next) {
  if (!req.body.data) return next({status:400, message:"No data object provided"})
  const { reservation_id } = req.body.data;
  if (!reservation_id) return next({status:400,message:"No reservation_id provided"})
  const foundReservation = await reservationService.read(reservation_id)
  if (foundReservation) {
      res.locals.reservation = foundReservation
      return next();
  };
  return next({
      status: 404,
      message: `Reservation does not exist: ${reservation_id}`
  });
}

async function validateTable(req, res, next) {
  const { data: table = {} } = req.body;
  const requiredFields = ["table_name", "capacity"]
  for (let field of requiredFields) {
    if (!table[field]) {
      return next({
        status: 400,
        message: `Table must include a ${field}`
      })
    }
  };
  if (table.table_name.length < 2) return next({ status: 400, message: "table_name must be at least 2 characters long" })
  if (table.capacity < 1||!Number.isInteger(table.capacity)) return next({ status: 400, message: "Table capacity must be a positive number" })
  res.locals.newTable = table;
  next();
}
async function createTable(req, res, next) {
  const { newTable } = res.locals
  const createdTable = await service.create(newTable);
  res.status(201).json({ data: createdTable });
}

async function seat(req,res,next) {
  const {reservation} = res.locals ; 
  const {table} = res.locals
  if (table.capacity < reservation.people) return next({status:400, message:"Sorry, that table does not have enough capacity to accomodate your party"})
  if (table.reservation_id) {
    return next({status:400, message:"Sorry, that table is already occupied"})}
  await service.put(table, reservation.reservation_id);
  res.json({data: "who cares"});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateTable), createTable],
  seat: [asyncErrorBoundary(reservationExists),asyncErrorBoundary(tableExists),seat]
};
