
import React from 'react'


import AI_Prompt_Field from "../components/AI_Prompt_Field.jsx";
import Hamburger_Menu from "../components/Hamburger_Menu.jsx";
import {Link} from "react-router-dom";


const Student_Account_Home_Page = () =>
{

    return (
        <div className = "background_image">
            <h2>Welcome!!!</h2>
            <></>
            <Link to = ""> </Link>
                <div style = { { padding: '24px' } }>
                    <Hamburger_Menu/>

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
