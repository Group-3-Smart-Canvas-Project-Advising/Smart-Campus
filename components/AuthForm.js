import React, { useState } from 'react';
import '../style.css';

const Block = () => (
  <div className="container">
  </div>
);

const AuthForm = ({ type, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (type === 'register' && password !== confirm) {
            alert("Passwords don't match");
            return;
        }
        onSubmit({ email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
            <div>
                <label>Email:</label>
                <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password" value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                />
            </div>
            {type === 'register' && (
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password" value={confirm}
                        onChange={(e) => setConfirm(e.target.value)} required
                    />
                </div>
            )}
            <button type="submit">{type === 'login' ? 'Login' : 'Register'}</button>
        </form>
    );
};

export default AuthForm;
