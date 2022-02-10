
/**
 * Defines the Reservation seating form component.
 * @param tables
 * an array of tables used to select where the reservation will be seated
 * @param submitHandler
 * a function that tells the form what to do once submitted
 * @param selected
 * tracks the currently selected table for seating and populates it with the first listed table on page load
 * @param cancelHandler
 * a function that handles what to do once the cancel button is pressed
 * @param changeHandler
 * handles tracking of form values when changes are made
 * @returns {JSX.Element}
 */
export default function SeaterForm ({tables, submitHandler, selected, cancelHandler,changeHandler}) {
    const options = tables.map((table)=>{
        return (<option key={table.table_id} value={table.table_id} >{table.table_name} - {table.capacity}</option>)
    })
    return (<form onSubmit={submitHandler}>Seat Reservation at an available table
            <div><select name="table_id" value={selected} onChange={changeHandler}>
            {options}
            </select></div>
            <button type="submit">Submit</button>
            <button onClick={cancelHandler}>Cancel</button>
        </form>)
}