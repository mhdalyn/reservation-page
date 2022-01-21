const knex = require("../db/connection")

function list(reservation_date) {
    return knex("reservations").select("*").where({reservation_date}).orderBy("reservation_time");
}
function create(reservation) {
    return knex("reservations").insert(reservation,"*").then((reservations)=>reservations[0]);
}
function read(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first();
}

module.exports = {
    list,
    create,
    read,
}