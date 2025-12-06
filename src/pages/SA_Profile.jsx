import React from 'react';
import './SA_Profile.css';

import ProfileIcon from '/profile.svg';

import Hamburger_Menu from "../components/Hamburger_Menu.jsx";

const SA_Profile = () =>
{


    return (

        <div className={'background_image'}>

            <div className="dashboard-header-right" >
                <div className="dashboard-badges">
                    <span className="badge badge-primary">
                        {role === "advisor" ? "Advisor" : "Student"}
                    </span>
                    <span className="badge badge-muted">Demo mode</span>

                </div>
            </div>

            <Hamburger_Menu/>

            <h2>
                Profile
            </h2>



            <div>
                <img src={ProfileIcon} alt="Profile" />
            </div>

        </div>
    );
}

export default SA_Profile;