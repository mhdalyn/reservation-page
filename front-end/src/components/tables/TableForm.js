import React from "react";

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