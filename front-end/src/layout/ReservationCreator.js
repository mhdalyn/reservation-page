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
        try {
            //checks if reservation is made for a time within available hours, is not in the past using new Date (which creates an object for now by default), and is not on a Tuesday before allowing submission
            const day = new Date(`${form.reservation_date} ${form.reservation_time}`);
            if (form.reservation_time < "10:30" || form.reservation_time > "21:30") throw new Error("Available reservation hours are 10:30am to 9:30pm")
            if (day < new Date()) throw new Error("Reservation must be for the future")
            if (day.getDay() === 2) throw new Error("Sorry, Periodic Tables is closed on Tuesdays")

            form.people = parseInt(form.people)
            await placeReservation(form)
            history.push(`/dashboard?date=${form.reservation_date}`)
        }
        catch (err) { setError(err) }
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