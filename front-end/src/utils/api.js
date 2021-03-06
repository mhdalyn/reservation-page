/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Saves reservation to the database
 * Form ensures that params are not null & further validation is done in back-end
 * @param reservation
 * the reservation to save
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<reservation>}
 * a promise that resolves the saved reservation
 */
export async function placeReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  }
  return await fetchJson(url, options, signal)
}

/**
 * Saves table to the database
 * Form ensures that params are not null & further validation is done in back-end
 * @param table
 * the table to save
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<table>}
 * a promise that resolves the saved table
 */
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify({ data: table }),
    signal,
  }
  return await fetchJson(url, options, signal)
}

/**
 * Retrieves all existing reservations.
 * @param params
 * filter parameter to control what reservations are returned
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<[reservations]>}
 *  a promise that resolves to a possibly empty array of reservations saved in the database.
 */
export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Retrieves all existing tables.
 * @param signal
 * optional AbortController.signal
 * @returns {Promise<[tables]>}
 *  a promise that resolves to a possibly empty array of tables saved in the database.
 */
export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, [])
}

/**
 * Retrieves an existing reservation.
 * @param reservation_id
 * used to determine which reservation is retrieved
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a reservation saved in the database.
 */
export async function readReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`)
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Updates a reservation's status to seated and marks a table as occupied.
 * @param reservation_id
 * used to determine which reservation is being seated
 * @param table_id
 * used to determine which table is being seated at
 * @param signal
 * optional AbortController.signal
 * @returns {Promise}
 *  a promise that resolves to an unused body.
 */
export async function seatTable(reservation_id, table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`)
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { reservation_id } }),
    signal,
  }
  return await fetchJson(url, options, signal)
}

/**
 * Updates a reservation's status to finished and marks a table as vacant.
 * @param table_id
 * used to determine which table is being freed up
 * @param signal
 * optional AbortController.signal
 * @returns {Promise}
 *  a promise that resolves to an unused body.
 */
export async function finishTable(table_id, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${table_id}/seat`);
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({ data: table_id }),
    signal,
  }
  return await fetchJson(url, options, signal)
}

/**
 * Updates a reservation.
 * @param reservation
 * used to determine which reservation is being changed
 * @param signal
 * optional AbortController.signal
 * @returns {Promise}
 *  a promise that resolves to an unused body.
 */
export async function editReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation.reservation_id}`
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: reservation }),
    signal,
  }
  return await fetchJson(url, options, signal)
}

/**
 * Updates a reservation's status to cancelled.
 * @param reservation_id
 * used to determine which reservation is being cancelled
 * @param signal
 * optional AbortController.signal
 * @returns {Promise}
 *  a promise that resolves to an unused body.
 */
export async function cancelReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}/status`)
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { status: "cancelled" } }),
    signal,
  }
  return await fetchJson(url, options, signal)
}