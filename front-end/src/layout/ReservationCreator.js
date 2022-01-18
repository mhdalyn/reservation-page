import React, { useState } from "react";
import { useHistory } from "react-router";
import ReservationForm from "../common/ReservationForm";
import { placeReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

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
        form.people = parseInt(form.people)
        try {
            await placeReservation(form)}
        catch (err){setError(err)}
        history.push(`/dashboard?date=${form.reservation_date}`)
    }

    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={error}/>
            <ReservationForm changeHandler={changeHandler} form={form} submitHandler={submitHandler} cancelHandler={cancelHandler} />
        </div>
    );
}