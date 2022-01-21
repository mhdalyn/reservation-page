import React from "react"
import { Link } from "react-router-dom"

export default function ReservationTable({ reservations }) {
    if (!reservations.length) return (<div>No reservations have been made for this date</div>)
    const tableContents = reservations.map(reservation=>{ 
        const {reservation_id} = reservation
        return (
        <tr>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <Link to={`/reservations/${reservation_id}/seat`}> Seat </Link>
        </tr>
    )})
    return (<table>
        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile Number</th>
                <th>Reservation Date</th>
                <th>Reservation Time</th>
                <th>Party Size</th>
            </tr>
        </thead>
        {tableContents}
    </table>)
}