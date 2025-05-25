// src/App.jsx
import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReservationsPage from './pages/ReservationsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import MakeReservationPage from './pages/MakeReservationPage';
import PrivateRoute from './components/PrivateRoute';
import useAuth from './hooks/useAuth'; // ✅ Fixed: Changed from { useAuth } to useAuth
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const App = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Update document title dynamically based on current route
  React.useEffect(() => {
    const titles = {
      '/': 'Home - Restaurant Reservations',
      '/auth/login': 'Login - Restaurant Reservations',
      '/auth/register': 'Register - Restaurant Reservations',
      '/reservations': 'My Reservations - Restaurant Reservations',
      '/make-reservation': 'Make Reservation - Restaurant Reservations',
      '/terms': 'Terms of Service - Restaurant Reservations',
      '/privacy': 'Privacy Policy - Restaurant Reservations',
    };

    const pageTitle = titles[location.pathname] || 'Restaurant Reservations';
    document.title = pageTitle;
  }, [location]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-dark text-white p-4 shadow-sm">
        <nav className="container d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <FontAwesomeIcon icon={faUtensils} className="me-2" style={{ fontSize: '30px', color: '#fff' }} />
            <span className="fs-4 fw-bold">Restaurant Reservations</span>
          </div>

          <div className="d-flex gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/reservations" className="btn btn-link text-white me-2">
                  My Reservations
                </Link>
                <button
                  className="btn btn-link text-white"
                  onClick={() => console.log('Logout')}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="btn btn-primary me-2">
                  Login
                </Link>
                <Link to="/auth/register" className="btn btn-success">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 container py-5 d-flex flex-column justify-content-center align-items-center main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />

          {/* Protected route */}
          <Route
            path="/make-reservation"
            element={
              <PrivateRoute>
                <MakeReservationPage />
              </PrivateRoute>
            }
          />

          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-light text-center text-muted p-3 mt-auto border-top">
        <p className="mb-0">
          © {new Date().getFullYear()} Restaurant Reservation App |
          <Link to="/terms" className="text-decoration-none text-muted mx-1">
            Terms
          </Link>
          |
          <Link to="/privacy" className="text-decoration-none text-muted mx-1">
            Privacy
          </Link>
        </p>
      </footer>
    </div>
  );
};

export default App;