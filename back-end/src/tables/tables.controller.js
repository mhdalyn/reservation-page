const e = require("cors");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service")
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  res.json({
    data: await service.list(),
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

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateTable), createTable]
};
