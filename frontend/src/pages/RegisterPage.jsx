import React from 'react';
import AuthForm from '../components/AuthForm';

const RegisterPage = () => {
  return (
    <div className="auth-page">
      <AuthForm mode="register" />
    </div>
  );
};

export default RegisterPage;