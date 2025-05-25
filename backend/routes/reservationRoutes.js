const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const {
  createReservation,
  updateReservation,
  deleteReservation,
  getUserReservations,
  getReservationById
} = require('../controllers/reservationController');

const router = express.Router();

// Create a new reservation
router.post('/', authenticateJWT, createReservation);

// Get all user reservations
router.get('/user/reservations', authenticateJWT, getUserReservations);

// ✅ NEW: Get specific reservation by ID
router.get('/:id', authenticateJWT, getReservationById);

// Update reservation
router.put('/:id', authenticateJWT, updateReservation);

// Delete reservation
router.delete('/:id', authenticateJWT, deleteReservation);

module.exports = router;