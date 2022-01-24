import React from "react"
import {finishTable} from "../utils/api"

export default function TablesTable({ tables, loadDashboard, setErr }) {
    async function finishHandler(event) {
        try {if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            const table_id = event.target.id;
            await finishTable(table_id);
            loadDashboard()
        }
        }catch (err) {setErr(err)}
    }

    const tableContents = tables.map(table=>{ return (
        <tr key={table.table_id} id={table.table_id}>
            <td>{table.table_name}</td>
            <td data-table-id-status={table.table_id} >{(table.reservation_id)?"Occupied":"Free"}</td>
            <td>{table.capacity}</td>
            {(table.reservation_id)?<button data-table-id-finish={table.table_id} id={table.table_id} onClick={finishHandler}>Finish</button>:null}
        </tr>
    )})
    return (<table>
        <thead className="thead-dark">
            <tr>
                <th>Table Name</th>
                <th>Reservation Status</th>
                <th>Table Capacity</th>
            </tr>
        </thead>
        <tbody>{tableContents}</tbody>
    </table>)
}