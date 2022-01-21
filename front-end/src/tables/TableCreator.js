import React, {useState} from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import TableForm from "./TableForm";

export default function TableCreator() {
    const history = useHistory()
    const initialForm = {
        table_name: "", capacity: ""
    }
    const [error, setError] = useState(null)
    const [form, setForm] = useState(initialForm)
    const changeHandler = ({ target }) => {
        setForm({ ...form, [target.name]: target.value })
    }

    async function submitHandler(event) {
        event.preventDefault();
        try {
            form.capacity = parseInt(form.capacity);
            await createTable(form);
            history.push(`/dashboard`)
        } catch (err) { setError(err) }
    }

    async function cancelHandler(event) {
        event.preventDefault();
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={error} />
            <TableForm changeHandler={changeHandler} form={form} submitHandler={submitHandler} cancelHandler={cancelHandler} />
        </div>
    );
}