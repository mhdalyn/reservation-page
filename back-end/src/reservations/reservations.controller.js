const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(req, res, next) {
  res.json({
    data: await service.list(),
  });
}

async function validateRezzo(req, res, next) {
  const {data: reservation = {}} = req.body;
  const requiredFields = ["first_name", "last_name","mobile_number","reservation_date", "reservation_time","people"]
  for(let field of requiredFields) {
    if(!reservation[field]) {
      next({
        status:400,
        message: `Reservation must include a ${field}`
      })
    }
  }
  if(!Number.isInteger(reservation.people)) {
    next({
        status:400,
        message: `people must be a number`
    })
  }
  if(!Number.isInteger(Date.parse(reservation.reservation_date))) {
    next({
      status:400,
      message: `${reservation.reservation_date} is not a valid reservation_date`
    })
  }
  res.locals.newReservation = reservation;
  next();

}

async function createRezzo(req, res, next) {
  const {newReservation} = res.locals
  const createdReservation = await service.create(newReservation);
  res.status(201).json({data:createdReservation});
}

module.exports = {
  list,
  create: [validateRezzo, createRezzo]
};
