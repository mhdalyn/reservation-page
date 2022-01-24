const { whereNot } = require("../db/connection");
const knex = require("../db/connection")

function list(reservation_date) {
    return knex("reservations").select("*").where({ reservation_date }).whereNot({ status: "finished" }).orderBy("reservation_time");
}

function listPhone(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

function create(reservation) {
    return knex("reservations").insert(reservation, "*").then((reservations) => reservations[0]);
}
function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first();
}

function changeStatus(reservation_id, status) {
    return knex("reservations").where({ reservation_id }).update({ "status": status })
}

module.exports = {
    listPhone,
    list,
    create,
    read,
    changeStatus
}