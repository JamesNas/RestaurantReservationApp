// src/pages/TermsPage.js
import React from 'react';

const TermsPage = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Terms of Service</h1>
      <p>
        These are the terms and conditions for using the Restaurant Reservations App. 
        By using this service, you agree to the following terms:
      </p>
      <ul>
        <li>You must be at least 18 years old.</li>
        <li>You agree to provide accurate information during registration.</li>
        <li>You are responsible for all activities that occur under your account.</li>
      </ul>
      <p>
        Last updated: January 1, 2025
      </p>
    </div>
  );
};

export default TermsPage;