const knex = require("../db/connection")

function list(table_id) {
    return knex("tables").select("*").orderBy("table_name")
}
function create(table) {
    return knex("tables").insert(table,"*").then((tables)=>tables[0]);
}

module.exports = {
    list,
    create,
}