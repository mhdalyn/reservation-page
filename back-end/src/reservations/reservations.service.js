const { whereNot } = require("../db/connection");
const knex = require("../db/connection")

/**
 * list function
 * @param reservation_date
 * a date string used to filter listed data
 * @returns
 * list of all reservations for a particular date ordered by time
 */
function list(reservation_date) {
    return knex("reservations").select("*").where({ reservation_date }).whereNot({ status: "finished" }).orderBy("reservation_time");
}

/**
 * list function
 * @param mobile_number
 * a phone number used to filter listed data
 * @returns
 * list of all reservations for a particular phone number ordered by date
 */
function listPhone(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

/**
 * database create function
 * @param reservation
 * reservation object to be saved
 * @returns
 * database object after creation
 */
function create(reservation) {
    return knex("reservations").insert(reservation, "*").then((reservations) => reservations[0]);
}

/**
 * read function
 * @param reservation_id
 * ID used to search database
 * @returns
 * database entry that matches provided reservation_id
 */
function read(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first();
}

/**
 * updates a reservation with the provided data
 * @param reservation
 * reservation object provided to overwrite existing reservation
 */
function update(reservation) {
    const {reservation_id} = reservation;
    return knex("reservations").select("*").where({reservation_id}).update(reservation)
}

/**
 * changes a reservation's status
 * @param reservation_id
 * ID used to search database
 * @param status
 * a status string representing the reservation's new state
 */
function changeStatus(reservation_id, status) {
    return knex("reservations").where({ reservation_id }).update({ "status": status })
}

module.exports = {
    listPhone,
    list,
    create,
    read,
    changeStatus,
    update
}