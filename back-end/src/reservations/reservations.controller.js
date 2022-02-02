const { formatAsDate, formatAsTime, today } = require("../date-time");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  const mobile_number = req.query.mobile_number;
  const displayDate = req.query.date;
  if (mobile_number) {
    return res.json({
      data: await service.listPhone(mobile_number)
    })
  } else {res.json({
    data: await service.list(displayDate),
  });}
}

async function ReservationExists(req,res,next) {
  const { reservation_id } = req.params;
  const foundReservation = await service.read(reservation_id)
  if (foundReservation) {
      res.locals.reservation = foundReservation
      return next();
  };
  return next({
      status: 404,
      message: `Reservation does not exist: ${reservation_id}`
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
  const day = new Date(`${reservation.reservation_date} ${reservation.reservation_time}`);
  if (day < new Date()) return next({status:400, message:"Reservation must be for the future"})
  if (day.getDay() === 2) return next({status:400, message:"Sorry, Periodic Tables is closed on Tuesdays"})
  if (reservation.reservation_time < "10:30" || reservation.reservation_time > "21:30") return next({status:400,message:"Available reservation hours are 10:30am to 9:30pm"})
  reservation.reservation_date = formatAsDate(reservation.reservation_date);
  reservation.reservation_time = formatAsTime(reservation.reservation_time);
  res.locals.reservation = reservation;
  next();
}
async function createRezzo(req, res, next) {
  const { reservation } = res.locals
  const createdReservation = await service.create(reservation);
  res.status(201).json({ data: createdReservation });
}

async function validateStatus(req,res,next) {
  const {status} =  res.locals.reservation
  if (status && status !== "booked") return next({status:400, message:`Cannot create reservation with ${status} status`})
  next();
}

async function changeStatus(req,res,next) {
  const {status} = req.body.data
  if (status !== "booked" && status !=="seated" && status!=="finished" && status!=="cancelled") return next({status:400, message:"Cannot update to an unknown reservation status"})
  const {reservation} = res.locals
  if (reservation.status === "finished") return next({status:400, message:`a finished reservation cannot be updated`})
  await service.changeStatus(reservation.reservation_id, status)
  res.status(200).json({data:{status:status}});
}

async function update(req,res,next) {
  const {reservation} = res.locals
  await service.update(reservation);
  res.status(200).json({data: await service.read(reservation.reservation_id) })
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(validateRezzo), validateStatus, asyncErrorBoundary(createRezzo)],
  read: [asyncErrorBoundary(ReservationExists),read],
  update: [asyncErrorBoundary(ReservationExists),asyncErrorBoundary(changeStatus)],
  updateForm: [ asyncErrorBoundary(ReservationExists), validateRezzo, asyncErrorBoundary(update)],
};
