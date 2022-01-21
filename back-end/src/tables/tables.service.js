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

function put(table, reservation_id) {
    return knex("tables").update({"reservation_id": reservation_id}).where({"table_id":table.table_id})
}

module.exports = {
    list,
    create,
    read,
    put
}