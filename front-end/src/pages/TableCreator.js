import React, {useState} from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import TableForm from "../components/tables/TableForm";

/**
 * Defines the Table Creator page.
 * 
 * @returns {JSX.Element}
 */
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
        const abortController = new AbortController();
        event.preventDefault();
        try {
            form.capacity = parseInt(form.capacity);
            await createTable(form, abortController.signal);
            history.push(`/dashboard`)
        } catch (err) { setError(err) }
        return () => abortController.abort();
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