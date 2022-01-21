import React, { useState } from "react";
import { useHistory } from "react-router";
import ReservationForm from "../reservations/ReservationForm";
import { placeReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationCreator() {
    const history = useHistory()
    const initialForm = {
        first_name: "", last_name: "", mobile_number: "", reservation_date: "", reservation_time: "", people: "1"
    }
    const [error, setError] = useState(null)
    const [form, setForm] = useState(initialForm)
    const changeHandler = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            form.people = parseInt(form.people)
            await placeReservation(form)
            history.push(`/dashboard?date=${form.reservation_date}`)
        } catch (err) { setError(err) }
    }

    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={error} />
            <ReservationForm changeHandler={changeHandler} form={form} submitHandler={submitHandler} cancelHandler={cancelHandler} />
        </div>
    );
}