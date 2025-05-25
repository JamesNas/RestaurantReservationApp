// src/pages/MakeReservationPage.js
import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';  // ✅ Changed from { useAuth } to useAuth
import { Navigate } from 'react-router-dom';

const MakeReservationPage = () => {
  const { isAuthenticated } = useAuth();

  const [formData] = useState({
    restaurantName: '',
    date: '',
    time: '',
  });

  console.log('MakeReservationPage mounted');
  console.log('isAuthenticated:', isAuthenticated); // ✅ Debug auth state

  if (!isAuthenticated) {
    console.warn('User not authenticated - Redirecting to login');
    return <Navigate to="/auth/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting reservation:', formData);

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // ✅ Send token
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Reservation failed:', errorData);
        throw new Error('Failed to create reservation');
      }

      const data = await response.json();
      console.log('✅ Reservation created:', data);
      alert('Reservation created successfully!');
    } catch (error) {
      console.error('❌ Error creating reservation:', error.message);
      alert('Error creating reservation. Please try again.');
    }
  };

  return (
    <div className="container text-center">
      <h1>Make a Reservation</h1>
      <form onSubmit={handleSubmit}>
        {/* ... rest of the form */}
      </form>
    </div>
  );
};

export default MakeReservationPage;