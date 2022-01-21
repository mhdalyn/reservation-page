import React from "react";
import { useParams } from "react-router";

export default function ReservationSeater() {
    const {reservation_id} = useParams();

    function submitHandler() {
        
    }

    return (<form onSubmit={submitHandler}>
        <select name="table_id"></select>
        <submit>Submit</submit>
    </form>)
}
