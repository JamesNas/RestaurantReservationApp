const jwt = require('jsonwebtoken');
const { hash, compare } = require('bcryptjs');
const pool = require('../config/db');
const jwtConfig = require('../config/jwtConfig');
const ms = require('ms');

/**
 * Registers a new user.
 */
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await hash(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      user_id: result.insertId,
      username,
      email
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Registration error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logs in an existing user and returns JWT token.
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.user_id,
      email: user.email,
      username: user.username
    };

    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });

    // Set token in HTTP-only cookie for better security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: ms(jwtConfig.expiresIn)
    });

    res.json({
      token,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Handles logout for JWT-based authentication.
 */
exports.logoutUser = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

/**
 * Checks if a valid session (JWT token) exists
 */
exports.checkSession = async (req, res) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.json({ user: null });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);

    const [rows] = await pool.execute(
      'SELECT user_id, username, email FROM users WHERE user_id = ?',
      [decoded.id]
    );

    if (!rows[0]) {
      return res.json({ user: null });
    }

    res.json({
      user: {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email
      }
    });

  } catch (err) {
    console.error('Session check error:', err.message);
    res.status(401).json({ message: 'Invalid or expired token', user: null });
  }
};