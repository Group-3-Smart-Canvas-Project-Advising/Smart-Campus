
import React from 'react'

import { Link, useNavigate } from 'react-router-dom';

import Button from "../components/Button.jsx";
import AI_Prompt_Field from "../components/AI_Prompt_Field.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";



const Student_Account_Home_Page = () =>
{
    const navigate = useNavigate();

    return (
        <div className = "background_image">
            <h2>Welcome!!!</h2>
            <></>
            <Link to = ""> </Link>
                <div style = { { padding: '24px' } }>
                    <Hamburger_Menu

                    />
                    <Button
                        text={'Log out'}
                        on_click_handler = {() => navigate('/')}
                        Logout
                    />
                </div>

                <div>
                    <AI_Prompt_Field
                        onSubmit = { () =>  alert('Thinking...')  }
                    />
                </div>

        </div>
    );
}

export default Student_Account_Home_Page;