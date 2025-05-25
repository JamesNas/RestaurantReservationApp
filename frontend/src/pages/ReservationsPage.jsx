// src/pages/ReservationsPage.js
import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth'; // ✅ Correct (matches your default export)
import { useNavigate } from 'react-router-dom'; // For navigation

const ReservationsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for client-side routing

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/reservations?user=${user.id}`);
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchReservations();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">My Reservations</h1>
      
      {loading && <p className="text-lg text-gray-600 dark:text-gray-300">Loading...</p>}
      
      {error && <p className="text-lg text-red-500">{error}</p>}
      
      {reservations.length > 0 ? (
        <ul className="w-full max-w-md text-left bg-white dark:bg-gray-800 shadow rounded p-6">
          {reservations.map((reservation) => (
            <li key={reservation.id} className="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <strong className="text-gray-900 dark:text-gray-100">{reservation.restaurantName}</strong>:{' '}
              <span className="text-gray-700 dark:text-gray-300">
                {reservation.date} at {reservation.time}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center max-w-sm mx-auto">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            No reservations found. Make a reservation today!
          </p>
          
          {/* 👇 IMPROVED BUTTON MATCHING THE DESIGN */}
          <button
            type="button"
            onClick={() => navigate('/make-reservation')}
            className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            aria-label="Make a new reservation"
          >
            Make a Reservation
          </button>
        </div>
      )}
    </div>
  );
};

export default ReservationsPage;