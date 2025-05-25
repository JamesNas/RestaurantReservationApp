// models/Restaurant.js

const pool = require('../config/db');

class Restaurant {
  constructor({ restaurant_id, name, location, description, created_at }) {
    this.restaurant_id = restaurant_id;
    this.name = name;
    this.location = location;
    this.description = description;
    this.created_at = created_at;
  }

  // Get all restaurants
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM restaurants');
    return rows.map(row => new Restaurant(row));
  }

  // Get one restaurant by ID
  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM restaurants WHERE restaurant_id = ?', [id]);
    return rows[0] ? new Restaurant(rows[0]) : null;
  }

  // Create a new restaurant
  static async create({ name, location, description }) {
    const [result] = await pool.query(
      'INSERT INTO restaurants (name, location, description) VALUES (?, ?, ?)',
      [name, location, description]
    );

    return new Restaurant({
      restaurant_id: result.insertId,
      name,
      location,
      description,
      created_at: new Date()
    });
  }

  // ✅ Add this method to fix the error:
  static async updateById(id, { name, location, description }) {
    const [result] = await pool.query(
      'UPDATE restaurants SET name = ?, location = ?, description = ? WHERE restaurant_id = ?',
      [name, location, description, id]
    );

    return result.affectedRows > 0;
  }
}

module.exports = Restaurant;