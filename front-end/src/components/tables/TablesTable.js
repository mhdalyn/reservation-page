import React from "react"
import {finishTable} from "../../utils/api"

/**
 * Defines the Table of tables component.
 * @param tables
 * an array of tables that exist in the restaurant
 * @param loadDashboard
 * a function that refreshes the dashboard page when a table is finished
 * @param setErr
 * passed in from parent component to set the page's error display to any errors encountered
 * @returns {JSX.Element}
 */
export default function TablesTable({ tables, loadDashboard, setErr }) {
    async function finishHandler(event) {
        const abortController = new AbortController();
        try {if(window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            const table_id = event.target.id;
            await finishTable(table_id, abortController.signal);
            loadDashboard()
        }
        }catch (err) {setErr(err)}
        return () => abortController.abort();
    }

    const tableContents = tables.map(table=>{ return (
        <tr key={table.table_id} id={table.table_id}>
            <td>{table.table_name}</td>
            <td>{(table.reservation_id)?"Occupied":"Free"}</td>
            <td>{table.capacity}</td>
            {(table.reservation_id)?<button id={table.table_id} onClick={finishHandler}>Finish</button>:null}
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