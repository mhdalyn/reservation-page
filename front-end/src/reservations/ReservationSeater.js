import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable, listTables } from "../utils/api";
import SeaterForm from "../utils/SeaterForm";

export default function ReservationSeater() {
    const { reservation_id } = useParams();
    const history = useHistory();
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([])
    const [selected, setSelected] = useState() 
    useEffect(() =>  {
        setError(null)
        const abortController = new AbortController();
        listTables(abortController.signal).then(setTables).catch(setError)
        return ()=> abortController.abort();
    }, [])

    async function submitHandler(event) {
        event.preventDefault();
        try {
            await seatTable(reservation_id, selected);
            history.push(`/dashboard`)
        } catch (error) { setError(error) }
    }
    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack();
    }
    const changeHandler = (event) => {
        setSelected(event.target.value)
    }

    return (<div>
        <ErrorAlert error={error} />
        <SeaterForm tables={tables} submitHandler={submitHandler} cancelHandler={cancelHandler} changeHandler={changeHandler} />
        </div>)
}
