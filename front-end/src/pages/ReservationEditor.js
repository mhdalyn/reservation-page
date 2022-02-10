import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ReservationForm from "../components/reservations/ReservationForm";
import { editReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the Reservation Editor page.
 * 
 * @returns {JSX.Element}
 */
export default function ReservationEditor() {
    const { reservation_id } = useParams();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [form, setForm] = useState(null);

    useEffect(() => {
        async function loadForm() {
            try {
                const response = await readReservation(reservation_id);
                setForm(response)
            } catch (error) { setError(error) }
        }
        loadForm();
    }, [reservation_id])

    async function submitHandler(form) {
        const abortController = new AbortController();
        try {
            form.people = parseInt(form.people)
            await editReservation(form, abortController.signal)
            history.push(`/dashboard?date=${form.reservation_date}`)
        } catch (err) { setError(err) }
        return () => abortController.abort();
    }

    return (<div>
        <ErrorAlert error={error} />
        {form && <ReservationForm initialForm={form} submitHandler={submitHandler} />}
    </div>)
}