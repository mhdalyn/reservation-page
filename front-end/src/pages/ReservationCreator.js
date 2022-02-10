import React, { useState } from "react";
import { useHistory } from "react-router";
import ReservationForm from "../components/reservations/ReservationForm";
import ErrorAlert from "../layout/ErrorAlert";
import { placeReservation } from "../utils/api";

/**
 * Defines the Reservation creator page.
 * 
 * @returns {JSX.Element}
 */
export default function ReservationCreator() {
    const history = useHistory()
    const [error, setError] = useState(null)

    async function submitHandler(form) {
        const abortController = new AbortController();
        try {
            form.people = parseInt(form.people)
            await placeReservation(form, abortController.signal)
            history.push(`/dashboard?date=${form.reservation_date}`)
        } catch (err) { setError(err) }
        return () => abortController.abort();
    }



    return (
        <div>
            <ErrorAlert error={error} />
            <ReservationForm submitHandler={submitHandler} />
        </div>
    );
}