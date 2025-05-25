import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import './AuthForm.css'; // Import the new CSS

const AuthForm = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    let newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }
    if (!isLogin && !username) {
      newErrors.username = 'Username is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setError(Object.values(newErrors).join(' '));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const res = await apiClient.post(endpoint, {
        ...(isLogin ? {} : { username }),
        email,
        password,
      });

      if (res.status === 200 || res.status === 201) {
        navigate('/reservations');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('Auth error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}
        {loading && <div className="spinner-border text-primary"></div>}
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
              />
              {error.includes('username') && (
                <div className="invalid-feedback">{error}</div>
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
            {error.includes('email') && (
              <div className="invalid-feedback">{error}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
              {error.includes('password') && (
                <div className="invalid-feedback">{error}</div>
              )}
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLogin ? 'Log In' : 'Register'}
          </button>
        </form>

        <p className="switch-mode mt-3 text-center">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <Link to="/auth/register" className="text-primary">
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary">
                Log In
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  mode: PropTypes.string.isRequired,
};

export default AuthForm;