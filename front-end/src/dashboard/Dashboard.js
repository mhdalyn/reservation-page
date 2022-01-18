import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Calendar from "./Calendar";
import { next, previous, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState((query.get("date"))?query.get("date"):date)
  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <button onClick={()=>setCurrentDate(previous(currentDate))}>Previous</button>
      <button onClick={()=>setCurrentDate(today())}>Today</button>
      <button onClick={()=>setCurrentDate(next(currentDate))}>Next</button>
      <Calendar />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
