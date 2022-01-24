const knex = require("../db/connection")

function list(table_id) {
    return knex("tables").select("*").orderBy("table_name")
}
function create(table) {
    return knex("tables").insert(table,"*").then((tables)=>tables[0]);
}

function read(table_id) {
    return knex("tables").select("*").where({table_id}).first()
}

function put(table, reservation_id = null) {
    return knex("tables").where({"table_id":table.table_id}).update({"reservation_id": reservation_id})
}

function destroy(reservation_id) {
    return knex("reservations").where({reservation_id}).del();
}

module.exports = {
    list,
    create,
    read,
    put,
    destroy
}