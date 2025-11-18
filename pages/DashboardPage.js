// src/pages/DashboardPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const navigate = useNavigate();

    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');      // Clear session
        navigate('/');                        // Redirect to login
    };

    if (!user) {
        return <p>You are not logged in.</p>;
    }

    return (
        <div>
            <h2>Welcome, {user.email}!</h2>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default DashboardPage;
