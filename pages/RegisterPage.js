import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  const handleRegister = (formData) => {
    console.log('Registering with:', formData);
    // TODO: connect to backend
  };

  return (
    <div>
      <AuthForm type="register" onSubmit={handleRegister} />
      <p>Already have an account? <Link to="/">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
