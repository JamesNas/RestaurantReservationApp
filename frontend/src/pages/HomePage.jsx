import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center home-page">
      <h1 className="display-4 mb-5">Welcome to Restaurant Reservations</h1>
      <p className="lead mb-5">
        Please log in or register to manage your reservations.
      </p>
      {/* Call-to-Action Buttons */}
      <div className="d-flex justify-content-center gap-3">
        <Link
          to="/auth/login"
          className="btn btn-primary px-5 py-2 fs-5"
        >
          Login
        </Link>
        <Link
          to="/auth/register"
          className="btn btn-success px-5 py-2 fs-5"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default HomePage;