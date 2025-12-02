import React from 'react'

import { Link, useNavigate } from 'react-router-dom';
import Button from "../components/Button.jsx";

const SA_Calendar = () =>
{
    const navigate = useNavigate();

    return (

        <div className={'background_image'}>

            <Button
                text={'Log out'}
                on_click_handler = {() => navigate('/')}
                Logout
            />

        </div>
    );
}

export default SA_Calendar;