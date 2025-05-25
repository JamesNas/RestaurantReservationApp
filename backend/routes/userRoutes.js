const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');

// Import controllers
const {
  getUserProfile,
  getUserReservations,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount
} = require('../controllers/userController');

const router = express.Router();

/**
 * @route   GET /api/user/reservations
 * @desc    Get all reservations for the logged-in user
 * @access  Private (JWT required)
 */
router.get('/reservations', authenticateJWT, getUserReservations);

/**
 * @route   GET /api/user/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticateJWT, getUserProfile);

/**
 * @route   PUT /api/user/profile
 * @desc    Update user profile (name, email, etc.)
 * @access  Private
 */
router.put('/profile', authenticateJWT, updateUserProfile);

/**
 * @route   PUT /api/user/password
 * @desc    Change user password
 * @access  Private
 */
router.put('/password', authenticateJWT, changeUserPassword);

/**
 * @route   DELETE /api/user
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/', authenticateJWT, deleteUserAccount);

// Optional: Catch-all for unknown routes
router.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = router;