const { whereNot } = require("../db/connection");
const knex = require("../db/connection")

function list(reservation_date) {
    return knex("reservations").select("*").where({reservation_date}).whereNot({status:"finished"}).orderBy("reservation_time");
}
function create(reservation) {
    return knex("reservations").insert(reservation,"*").then((reservations)=>reservations[0]);
}
function read(reservation_id) {
    return knex("reservations").select("*").where({reservation_id}).first();
}

function changeStatus(reservation_id, status) {
    return knex("reservations").where({reservation_id}).update({"status":status})
}

module.exports = {
    list,
    create,
    read,
    changeStatus
}