
const Login_Button = ( { on_click_handler, is_disabled } ) =>
{
    return (
        <button
         type = 'submit'
         onClick = { on_click_handler }
         className = 'login_button'
         disabled = { is_disabled }
         >
            { is_disabled ? "Logging in..." : "Login" }
        </button>
    );
};

export default Login_Button;