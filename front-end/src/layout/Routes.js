import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { today } from "../utils/date-time";
import ReservationCreator from "../pages/ReservationCreator";
import ReservationSeater from "../pages/ReservationSeater";
import TableCreator from "../pages/TableCreator";
import SearchPage from "../pages/SearchPage";
import NotFound from "./NotFound"
import ReservationEditor from "../pages/ReservationEditor";

/**
 * Defines all the routes for the application.
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
      <Route path="/search">
        <SearchPage />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationEditor />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
