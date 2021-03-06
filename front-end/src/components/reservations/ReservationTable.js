import React from "react"
import { Link } from "react-router-dom"
import { cancelReservation, listReservations } from "../../utils/api";

/**
 * Defines the Table of reservations component.
 * @param reservations
 * an array of reservations made for the restaurant
 * @param nullMessage
 * a message that displays when nothing else is rendered 
 * @param setReservations
 * passed in from parent component to set the page's error display to any errors encountered
 * @param mobile_number
 * @param date
 * Only one of these will be passed in based on what page is using the component, conditionally determines what to render on the page
 * @returns {JSX.Element}
 */
export default function ReservationTable({ reservations , nullMessage , setReservations , mobile_number, date}) {
    if (!reservations.length) return (<div>{nullMessage}</div>)

    async function cancelHandler(event) {
        const abortController = new AbortController();
        event.preventDefault();
        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            await cancelReservation(event.target.id, abortController.signal);
            setReservations(await listReservations((mobile_number)?{mobile_number:mobile_number}:{date:date}), abortController.signal)
        }
        return () => abortController.abort();
    }

    let tableContents = []
    if (mobile_number) {
        tableContents = reservations.map(reservation=>{ 
        const {reservation_id} = reservation
        return (<tr key={reservation_id}>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
            <td>{reservation.status}</td>
            {(reservation.status==="booked")?<Link to={`/reservations/${reservation_id}/seat`}> Seat </Link>:null}
            {(reservation.status!=="cancelled")?<><td><Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation_id}/edit`} >Edit</Link></td>
            <td><button id={reservation_id} onClick={cancelHandler} >Cancel</button></td></>:null}
        </tr>)})
    } else {
        tableContents = reservations.map(reservation=>{ 
            const {reservation_id} = reservation
            return ((reservation.status!=="finished" && reservation.status!=="cancelled")?
            <tr key={reservation_id}>
                <td>{reservation.first_name}</td>
                <td>{reservation.last_name}</td>
                <td>{reservation.mobile_number}</td>
                <td>{reservation.reservation_date}</td>
                <td>{reservation.reservation_time}</td>
                <td>{reservation.people}</td>
                <td>{reservation.status}</td>
                {(reservation.status==="booked")?<Link to={`/reservations/${reservation_id}/seat`}> Seat </Link>:null}
                {(reservation.status!=="cancelled")?<><td><Link to={`/reservations/${reservation_id}/edit`} href={`/reservations/${reservation_id}/edit`} >Edit</Link></td>
                <td><button id={reservation_id} onClick={cancelHandler} >Cancel</button></td></>:null}
            </tr>:null)})
    }

    if (!(tableContents.join("")).length>0) return (<div>{nullMessage}</div>)
    return (<table>
        <thead>
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile Number {mobile_number}</th>
                <th>Reservation Date {date}</th>
                <th>Reservation Time</th>
                <th>Party Size</th>
                <th>Reservation Status</th>
            </tr>
        </thead>
        <tbody>{tableContents}</tbody>
    </table>)
}