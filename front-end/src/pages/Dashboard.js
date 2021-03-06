import React, { useEffect, useState } from "react";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationTable from "../components/reservations/ReservationTable";
import TablesTable from "../components/tables/TablesTable";
import { today, previous, next } from "../utils/date-time";
import { listReservations, listTables } from "../utils/api";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const query = useQuery();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([])
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [currentDate, setCurrentDate] = useState((query.get("date")) ? query.get("date") : date)
  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date: currentDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {currentDate}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <button onClick={() => setCurrentDate(previous(currentDate))}>Previous</button>
      <button onClick={() => setCurrentDate(today())}>Today</button>
      <button onClick={() => setCurrentDate(next(currentDate))}>Next</button>
      <ReservationTable reservations={reservations} nullMessage="No reservations have been made for this date" setReservations={setReservations} date={currentDate} />
      <ErrorAlert error={tablesError} />
      <TablesTable tables={tables} loadDashboard={loadDashboard} setErr={setTablesError} />
    </main>
  );
};

export default Dashboard;
