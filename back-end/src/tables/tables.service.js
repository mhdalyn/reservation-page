const knex = require("../db/connection")

/**
 * list function
 * @returns
 * list of all tables ordered by name
 */
function list() {
    return knex("tables").select("*").orderBy("table_name")
}

/**
 * database create function
 * @param table
 * table object to be saved
 * @returns
 * database object after creation
 */
function create(table) {
    return knex("tables").insert(table,"*").then((tables)=>tables[0]);
}

/**
 * read function
 * @param table_id
 * ID used to search database
 * @returns
 * database entry that matches provided table_id
 */
function read(table_id) {
    return knex("tables").select("*").where({table_id}).first()
}

/**
 * changes a table's reservation_id to match the ID provided
 * @param table_id
 * ID used to search database
 * @param reservation_id
 * defaults to null to change table to vacant, if ID is provided changes table to occupied by given party
 */
function put(table, reservation_id = null) {
    return knex("tables").where({"table_id":table.table_id}).update({"reservation_id": reservation_id})
}

module.exports = {
    list,
    create,
    read,
    put,
}