const Button = ({
                    on_click_handler,
                    is_disabled = false,
                    text = "Disabled",
                    loading_text = "Loading...",
                    type = "button",
                    className = "button",
                    style = {}
                }) =>
{
    return (
        <button
            type={type}
            onClick={on_click_handler}
            className={className}
            disabled={is_disabled}
            style={style}
        >
            {is_disabled ? loading_text : text}
        </button>
    );
};

export default Button;