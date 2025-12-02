const Button = ({
                    on_click_handler,
                    is_disabled = false,
                    text = "Click Me",
                    loading_text = "Loading...",
                    type = "button",
                    className = "button"
                }) =>
{
    return (
        <button
            type={type}
            onClick={on_click_handler}
            className={className}
            disabled={is_disabled}
        >
            {is_disabled ? loading_text : text}
        </button>
    );
};

export default Button;