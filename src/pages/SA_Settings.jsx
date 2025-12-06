import React from 'react'


import Hamburger_Menu from "../components/Hamburger_Menu.jsx";

const SA_Settings = () =>
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
                Settings
            </h2>

        </div>
    );
}

export default SA_Settings;