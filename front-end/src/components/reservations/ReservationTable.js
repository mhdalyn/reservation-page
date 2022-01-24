import React from "react"
import { Link } from "react-router-dom"

export default function ReservationTable({ reservations , nullMessage }) {
    if (!reservations.length) return (<div>{nullMessage}</div>)
    const tableContents = reservations.map(reservation=>{ 
        const {reservation_id} = reservation
        return ((reservation.status!=="finished")?
        <tr key={reservation_id}>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td data-reservation-id-status={reservation.reservation_id} >{reservation.status}</td>
            {(reservation.status==="booked")?<Link to={`/reservations/${reservation_id}/seat`}> Seat </Link>:null}
        </tr>
    :null)})
    return (<table>
        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile Number</th>
                <th>Reservation Date</th>
                <th>Reservation Time</th>
                <th>Party Size</th>
                <th>Reservation Status</th>
            </tr>
        </thead>
        <tbody>{tableContents}</tbody>
    </table>)
}