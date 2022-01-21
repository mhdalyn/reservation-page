import React from "react"

export default function TablesTable({ tables }) {
    const tableContents = tables.map(table=>{ return (
        <tr key={table.table_id}>
            <td>{table.table_name}</td>
            <td data-table-id-status={table.table_id} >{(table.reservation_id)?"Occupied":"Free"}</td>
            <td>{table.capacity}</td>
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