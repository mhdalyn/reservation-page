export default function SeaterForm ({tables, submitHandler, selected, cancelHandler,changeHandler}) {
    const options = tables.map((table)=>{
        return (<option key={table.table_id} value={table.table_id} >{table.table_name}</option>)
    })
    return (<form onSubmit={submitHandler}>Seat Reservation at an available table
            <div><select name="table_id" value={selected} onChange={changeHandler}>
            {options}
            </select></div>
            <button type="submit">Submit</button>
            <button onClick={cancelHandler}>Cancel</button>
        </form>)
}