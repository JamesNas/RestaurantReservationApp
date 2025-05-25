const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor({ user_id, username, email, password_hash, created_at }) {
    this.user_id = user_id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at;
  }

  static async create({ username, email, password }) {
    if (!username || !email || !password) {
      throw new Error('Username, email, and password are required.');
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists.');
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      throw new Error('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );

      return new User({
        user_id: result.insertId,
        username,
        email,
        password_hash: hashedPassword,
        created_at: new Date(),
      });
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw new Error('Failed to create user.');
    }
  }

  static async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0] || null;
  }

  static async authenticate(email, password) {
    const user = await User.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials.');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid credentials.');
    }

    return user;
  }
}

module.exports = User;