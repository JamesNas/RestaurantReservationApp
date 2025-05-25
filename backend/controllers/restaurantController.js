const pool = require('../config/db.js');

/**
 * Gets all restaurants.
 */
async function getAllRestaurants(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM restaurants');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Creates a new restaurant.
 */
async function createRestaurant(req, res) {
  const { name, location, description } = req.body;

  if (!name || !location) {
    return res.status(400).json({ message: 'Name and location are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO restaurants (name, location, description) VALUES (?, ?, ?)',
      [name, location, description]
    );

    res.status(201).json({
      restaurantId: result.insertId,
      name,
      location,
      description
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Updates a restaurant.
 */
async function updateRestaurant(req, res) {
  const { id } = req.params;
  const { name, location, description } = req.body;

  try {
    const [result] = await pool.query(
      'UPDATE restaurants SET name = ?, location = ?, description = ? WHERE restaurant_id = ?',
      [name, location, description, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Deletes a restaurant.
 */
async function deleteRestaurant(req, res) {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM restaurants WHERE restaurant_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

/**
 * Gets a restaurant by ID.
 */
async function getRestaurantById(req, res) {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM restaurants WHERE restaurant_id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Export all functions using CommonJS
module.exports = {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById
};