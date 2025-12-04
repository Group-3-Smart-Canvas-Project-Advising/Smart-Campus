import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Hamburger_Menu.css';

const Hamburger_Menu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="hamburger-container">
            <button
                className={`hamburger ${isOpen ? 'open' : ''}`}
                onClick={toggleMenu}
                aria-label="Menu"
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            {isOpen && (
                <div className="menu-overlay" onClick={closeMenu}></div>
            )}

            <nav className={`menu ${isOpen ? 'open' : ''}`}>
                <ul>
                    <li><Link to="/student_home" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                    <li><Link to="/calendar" onClick={closeMenu}>Calendar</Link></li>
                    <li><Link to="/profile" onClick={closeMenu}>Profile</Link></li>
                    <li><Link to="/settings" onClick={closeMenu}>Settings</Link></li>
                    <li><Link to="/" onClick={closeMenu}>Logout</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Hamburger_Menu;