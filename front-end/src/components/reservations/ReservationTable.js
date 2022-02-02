import React from "react"
import { Link } from "react-router-dom"
import { cancelReservation, listReservations } from "../../utils/api";

export default function ReservationTable({ reservations , nullMessage , setReservations , mobile_number, date}) {
    if (!reservations.length) return (<div>{nullMessage}</div>)

    async function cancelHandler(event) {
        event.preventDefault();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            await cancelReservation(event.target.id);
            setReservations(await listReservations((mobile_number)?{mobile_number:mobile_number}:{date:date}))
        }
    }

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
            {(reservation.status!=="cancelled")?<><td><Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation_id}/edit`} >Edit</Link></td>
            <td><button data-reservation-id-cancel={reservation.reservation_id} id={reservation_id} onClick={cancelHandler} >Cancel</button></td></>:null}
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