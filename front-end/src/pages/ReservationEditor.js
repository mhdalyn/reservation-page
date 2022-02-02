import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ReservationForm from "../components/reservations/ReservationForm";
import { editReservation, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationEditor() {
    const { reservation_id } = useParams();
    const history = useHistory();
    const [error, setError] = useState(null)
    const [form, setForm] = useState({})

    useEffect(() => {
        async function loadForm() {
            try {
                const response = await readReservation(reservation_id);
                setForm(response)
            } catch (error) { setError(error) }
        }
        loadForm();
    }, [reservation_id])

    const changeHandler = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }
    async function submitHandler(event) {
        event.preventDefault();
        try {
            form.people = parseInt(form.people)
            await editReservation(form)
            history.push(`/dashboard?date=${form.reservation_date}`)
        } catch (err) { setError(err) }
    }

    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack();
    }
    return (<div>
        <ErrorAlert error={error} />
        <ReservationForm changeHandler={changeHandler} form={form} submitHandler={submitHandler} cancelHandler={cancelHandler} />
    </div>)
}