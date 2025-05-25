const express = require('express');
const { 
  registerUser, 
  loginUser, 
  logoutUser,
  checkSession // 👈 Add this import
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/session', checkSession); // 👈 Add this line

module.exports = router;