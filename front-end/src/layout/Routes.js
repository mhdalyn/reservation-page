import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationCreator from "../reservations/ReservationCreator";
import { today } from "../utils/date-time";
import TableCreator from "../tables/TableCreator";
import ReservationSeater from "../reservations/ReservationSeater";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/reservations/new">
        <ReservationCreator />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <ReservationSeater />
      </Route>
      <Route path="/tables/new">
        <TableCreator />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
