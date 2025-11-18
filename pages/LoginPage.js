import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ userList = [] }) => {
    const navigate = useNavigate();

    const handleLogin = ({ email, password }) => {
        const user = userList.find(
            (user) => user.email === email && user.password === password
        );

        if (user) {
            console.log('✅ Login successful for:', user.email);
            localStorage.setItem('user', JSON.stringify(user)); // Store user session
            navigate('/dashboard'); // Redirect to dashboard
        } else {
            alert('❌ Invalid email or password');
        }
    };

  return (
    <div>
      <AuthForm type="login" onSubmit={handleLogin} />
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
};

export default LoginPage;
