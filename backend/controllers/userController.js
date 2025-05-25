const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Get current user profile
async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [rows] = await pool.execute(
      'SELECT username, email FROM users WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.error('Get user profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get reservations for the current user
async function getUserReservations(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const query = `
      SELECT r.*, res.name AS restaurant_name
      FROM reservations r
      LEFT JOIN restaurants res ON r.restaurant_id = res.restaurant_id
      WHERE r.user_id = ?
      LIMIT ?, ?
    `;

    const [rows] = await pool.execute(query, [userId, offset, limit]);

    res.json(rows);
  } catch (error) {
    console.error('Get user reservations error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update user profile (username, email)
async function updateUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Check for duplicate email
    const existingUser = await User.findByEmail(email);
    if (existingUser && existingUser.user_id !== userId) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    await pool.execute(
      'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
      [username, email, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// Change user password
async function changeUserPassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const isStrongPassword = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      return regex.test(password);
    };

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.'
      });
    }

    // Get current hashed password from DB
    const [rows] = await pool.execute(
      'SELECT password_hash FROM users WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete user account
async function deleteUserAccount(req, res) {
  try {
    const userId = req.user.id;

    // Delete related reservations
    await pool.execute('DELETE FROM reservations WHERE user_id = ?', [userId]);

    // Delete user
    await pool.execute('DELETE FROM users WHERE user_id = ?', [userId]);

    res.json({ message: 'User account deleted' });
  } catch (error) {
    console.error('Delete user error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getUserProfile,
  getUserReservations,
  updateUserProfile,
  changeUserPassword,
  deleteUserAccount
};