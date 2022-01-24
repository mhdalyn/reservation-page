import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { seatTable, listTables} from "../utils/api";
import SeaterForm from "./SeaterForm";

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

    useEffect(()=>{
        if (tables.length) setSelected(tables[0].table_id)
    }, [tables])

    async function submitHandler(event) {
        event.preventDefault();
        try {
            await seatTable(reservation_id, selected);
            history.push(`/dashboard`)
        } catch (err) { setError(err) }
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
