import React from "react";

/**
 * Defines the tables form component.
 * @param submitHandler
 * a function that tells the form what to do once submitted
 * @param cancelHandler
 * a function that handles what to do once the cancel button is pressed
 * @param form
 * tells the form what to render initially on page load
 * @param changeHandler
 * handles tracking of form values when changes are made
 * @returns {JSX.Element}
 */
export default function TableForm({submitHandler, cancelHandler, form, changeHandler}) {
    return(<form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="table_name">Table Name</label>
                    <input type="text" name="table_name" required placeholder="Table Name" onChange={changeHandler} value={form.table_name} />
                </div>
                <div>
                    <label htmlFor="capacity">Capacity</label>
                    <input type="text" name="capacity" required onChange={changeHandler} value={form.capacity} />
                </div>
                <div>
                <button className="btn btn-danger" onClick={cancelHandler} >Cancel</button>
                <button className="btn btn-primary" type="submit">Submit</button>
                </div>
            </form>)
}