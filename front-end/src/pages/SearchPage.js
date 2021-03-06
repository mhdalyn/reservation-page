import ErrorAlert from "../layout/ErrorAlert";
import { useState } from "react";
import ReservationTable from "../components/reservations/ReservationTable";
import { listReservations } from "../utils/api";

/**
 * Defines the Search by phone # page.
 * 
 * @returns {JSX.Element}
 */
export default function SearchPage() {
    const [error, setError] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [mobile_number, setMobileNumber] = useState("")
    function changeHandler(event) {
        setMobileNumber(event.target.value)
    }
    async function submitHandler(event) {
        const abortController = new AbortController();
        event.preventDefault();
        try {
            setError(null);
            const results = await listReservations({mobile_number: mobile_number},abortController.signal);
            setReservations(results);
        } catch (error) {setError(error)}
        return () => abortController.abort();
    }
    return (<div>
        <ErrorAlert error={error} />
        <form onSubmit={submitHandler}>
        <input name="mobile_number" type="tel" required placeholder="Enter a customer's phone number" value={mobile_number} onChange={changeHandler} />
        <button type="submit">Find</button>
        </form>
        <ReservationTable reservations={reservations} nullMessage="No reservations found" setReservations={setReservations} mobile_number={mobile_number} />
    </div>)
}