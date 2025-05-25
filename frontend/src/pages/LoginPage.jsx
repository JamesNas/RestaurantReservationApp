import React from 'react';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  return (
    <div className="auth-page">
      <AuthForm mode="login" />
    </div>
  );
};

export default LoginPage;