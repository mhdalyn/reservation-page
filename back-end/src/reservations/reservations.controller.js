import { formatAsDate, formatAsTime, today } from ("../date-time");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const displayDate = req.query.date;
  if (!displayDate) displayDate = today();
  res.json({
    data: await service.list(displayDate),
  });
}

async function validateRezzo(req, res, next) {
  const { data: reservation = {} } = req.body;
  const requiredFields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"]
  for (let field of requiredFields) {
    if (!reservation[field]) {
      return next({
        status: 400,
        message: `Reservation must include a ${field}`
      })
    }
  }
  if (!Number.isInteger(reservation.people)) {
    return next({
      status: 400,
      message: `people must be a number`
    })
  }
  if (!Number.isInteger(Date.parse(reservation.reservation_date))) {
    return next({
      status: 400,
      message: `${reservation.reservation_date} is not a valid reservation_date`
    })
  }
  if (!Number.isInteger(parseInt(reservation.reservation_time))) {
    return next({
      status: 400,
      message: `${reservation.reservation_time} is not a valid reservation_time`
    })
  }
  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  reservation.reservation_time = formatAsTime(reservation.reservation_time);
  res.locals.newReservation = reservation;
  next();
}
async function createRezzo(req, res, next) {
  const { newReservation } = res.locals
  const createdReservation = await service.create(newReservation);
  res.status(201).json({ data: createdReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateRezzo), createRezzo]
};
