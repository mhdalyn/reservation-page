import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "./ErrorAlert";

export default function ReservationCreator() {
    const history = useHistory()
    let err = null;
    const initialForm = {
        first_name: "", last_name: "", mobile_number: "", reservation_date: "", reservation_time: "", people: "1"
    }
    const [form, setForm] = useState(initialForm)
    const changeHandler = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }
    async function submitHandler(event) {
        event.preventDefault();
        
        history.push(`/dashboard?date=${form.reservation_date}`)
    }
    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack();
    }
    return (
        <div>
            <ErrorAlert error={err}/>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="first_name">First Name</label>
                    <input type="text" name="first_name" required placeholder="First Name" onChange={changeHandler} value={form.first_name} />
                </div>
                <div>
                    <label htmlFor="last_name">Last Name</label>
                    <input type="text" name="last_name" required placeholder="Last Name" onChange={changeHandler} value={form.last_name} />
                </div>
                <div>
                    <label htmlFor="mobile_number">Mobile Number</label>
                    <input type="tel" name="mobile_number" required onChange={changeHandler} value={form.mobile_number} />
                </div>
                <div>
                    <label htmlFor="reservation_date">Reservation Date</label>
                    <input type="date" name="reservation_date" required onChange={changeHandler} value={form.reservation_date} />
                </div>
                <div>
                    <label htmlFor="reservation_time">Reservation Time</label>
                    <input type="time" name="reservation_time" required onChange={changeHandler} value={form.reservation_time} />
                </div>
                <div>
                    <label htmlFor="people">Number of People</label>
                    <input type="number" min="1" max="10" name="people" required onChange={changeHandler} value={form.people} />
                </div>
                <div>
                <button className="btn btn-danger" onClick={cancelHandler} >Cancel</button>
                <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
}