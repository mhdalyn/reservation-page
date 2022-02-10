const e = require("cors");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")
const reservationService = require("../reservations/reservations.service")
const reservationController = require("../reservations/reservations.controller")

/**
 * List handler for table resources
 */
async function list(req, res, next) {
  res.json({
    data: await service.list(),
  });
}

/**
 * Validates that table_id corresponds to a database entry
 */
async function tableExists(req, res, next) {
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

/**
 * Validates that reservation_id corresponds to a database entry
 */
async function reservationExists(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "No data object provided" })
  const { reservation_id } = req.body.data;
  if (!reservation_id) return next({ status: 400, message: "No reservation_id provided" })
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

/**
 * Validates that a table object's properties exist and meet business requirements
 */
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
  if (table.capacity < 1 || !Number.isInteger(table.capacity)) return next({ status: 400, message: "Table capacity must be a positive number" })
  res.locals.newTable = table;
  next();
}

/**
 * Submits a validated table object to the database to be saved and returns the created entry
 */
async function createTable(req, res, next) {
  const { newTable } = res.locals
  const createdTable = await service.create(newTable);
  res.status(201).json({ data: createdTable });
}

/**
 * Updates a table to occupied and reservation to seated
 */
async function seat(req, res, next) {
  const { reservation, table } = res.locals;
  if (table.capacity < reservation.people) return next({ status: 400, message: "Sorry, that table does not have enough capacity to accomodate your party" })
  if (table.reservation_id) {
    return next({ status: 400, message: "Sorry, that table is already occupied" })
  }
  if (reservation.status === "seated") return next({status:400, message:"That table is already seated"})
  await service.put(table, reservation.reservation_id);
  await reservationService.changeStatus(reservation.reservation_id, "seated")
  res.json({ data: "who cares" });
}

/**
 * Updates a table to vacant and reservation to finished
 */
async function finishTable(req, res, next) {
  const {table} = res.locals;
  if(!table.reservation_id) return next({status:400, message: "That table is currently not occupied."})
  await service.put(table);
  await reservationService.changeStatus(table.reservation_id, "finished")
  res.json({data: table.reservation_id});
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateTable), createTable],
  seat: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), seat],
  finishTable: [asyncErrorBoundary(tableExists), asyncErrorBoundary(finishTable)]
};
