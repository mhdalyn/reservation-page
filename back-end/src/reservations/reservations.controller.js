const { formatAsDate, formatAsTime, today } = require("../date-time");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  let displayDate = req.query.date;
  if (!displayDate) displayDate = today();
  res.json({
    data: await service.list(displayDate),
  });
}

async function ReservationExists(req,res,next) {
  const { reservation_Id } = req.params;
  const foundReservation = await service.read(reservation_Id)
  if (foundReservation) {
      res.locals.reservation = foundReservation
      return next();
  };
  return next({
      status: 404,
      message: `Reservation does not exist: ${reservation_Id}`
  });
}

function read(req,res,next) {
  res.json({data:res.locals.reservation})
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
  if (reservation.reservation_time < "10:30" || reservation.reservation_time > "21:30") return next({status:400,message:"Available reservation hours are 10:30am to 9:30pm"})
  const day = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`);
  if (day < new Date()) return next({status:400, message:"Reservation must be for the future"})
  if (day.getDay() === 2) return next({status:400, message:"Sorry, Periodic Tables is closed on Tuesdays"})
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
  create: [asyncErrorBoundary(validateRezzo), asyncErrorBoundary(createRezzo)],
  read: [asyncErrorBoundary(ReservationExists),read]
};
