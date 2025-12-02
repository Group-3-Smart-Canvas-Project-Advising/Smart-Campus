import React, {lazy, Suspense, useState} from 'react'
import {useNavigate} from "react-router-dom";


import './App.css'
import './components/Text_Input_Field.jsx'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './pages/Student_Account_Home_Page.jsx';
import Text_Input_Field from "./components/Text_Input_Field.jsx";
import Login_Button from "./components/Login_Button.jsx";


//Create page routes
const page_routes =
    [
        { path: '/success', filename: 'Student_Account_Home_Page' },
    ];


// Create a map of lazy-loaded components
const componentMap = {};
page_routes.forEach((route) =>
{
    componentMap[route.filename] =
        lazy(() =>
            import(`./pages/${route.filename}.jsx`));
});




const LoginPage = () => {

    const [Username, set_Username] = useState('');
    const [password, set_Password] = useState('');
    const [is_loading, set_is_loading] = useState(false);
    const navigate = useNavigate();

    // This function is the main login logic
    const handle_login_submit = async (event) => {
        event.preventDefault(); // Stop the form from refreshing the page
        set_is_loading(true);

        console.log('Login attempt:', Username, password);

        // Simulate an API call with a delay
        try {
            // Replace this with your actual API call (e.g., fetch('/api/login', ...))
            const success = await new Promise(resolve => setTimeout(() => {
                resolve(Username === 'user' && password === 'password');
            }, 1000));

            if (success) {
                //alert('Login successful!');
                // Update global user state here if needed
                navigate('/success'); // Navigate to a new page
            } else {
                alert('Invalid username or password.');
                set_is_loading(false);
            }
        } catch (error) {
            console.error("Login failed:", error);
            set_is_loading(false);
        }
    };

    return (
        <div className = "background_image" >
            <h1>Smart Campus</h1>
            {/* The form calls handleLoginSubmit when submitted */}
            <form onSubmit = { handle_login_submit } >
                <div className = "login_component_group" >

                    <div
                        style = { {  backgroundColor: 'rgba( 100, 100, 100, 0.3 )', borderRadius: '16px', overflow: 'hidden'  } } >
                        <div style = { {  padding: '8px'  } } >
                            <Text_Input_Field
                                place_holder_text = { "Username" }
                                text = { Username }
                                on_change_handler = { set_Username }
                            ></Text_Input_Field>
                        </div>

                        <div style = { {  padding: '8px'  } } >

                            <Text_Input_Field
                                place_holder_text = { "Password" }
                                text = { password }
                                on_change_handler = { set_Password }
                            ></Text_Input_Field>
                        </div>

                        <div style = { {  padding: '8px'  } }>

                            <Login_Button
                                on_click_handler = { handle_login_submit }
                                is_disabled = { is_loading }
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

    const App = () =>
    {
    return (
            <BrowserRouter>
                <Suspense fallback = {<div>Loading...</div>}>
                    <Routes>
                        <Route path = '/' element = { < LoginPage /> } >   </Route>
                        {
                            page_routes.map(
                                (route) =>
                            (
                                <Route
                                    key = {route.filename}
                                    path = {route.path}
                                    element = {React.createElement(componentMap[route.filename])}
                                />
                            )
                            )
                        }
                    </Routes>
                </Suspense>
            </BrowserRouter>
    );
};

export default App
