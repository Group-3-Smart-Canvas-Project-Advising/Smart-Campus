
const Text_Input_Field = ( { place_holder_text, text, on_change_handler } ) => {

    return (
        <div>
            <label htmlFor = "myInput" > </label>
            <input
                type     = "text"
                id       = "myInput"
                value    = { text }         // The input's value is controlled by the state
                onChange = { (e) => on_change_handler(e.target.value) }  // Call handleChange when the value changes
                placeholder = {place_holder_text}
                required
            />
        </div>
    );
}

export default Text_Input_Field;