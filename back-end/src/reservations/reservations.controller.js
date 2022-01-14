const service = require("./reservations.service")
/**
 * List handler for reservation resources
 */
async function list(req, res,next) {
  res.json({
    data: await service.list(),
  });
}

module.exports = {
  list,
};
