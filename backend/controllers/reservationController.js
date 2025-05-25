const pool = require('../config/db.js');

// Enhanced with logging and error handling
const createReservation = async (req, res) => {
  console.log('[CREATE] Request received:', {
    user: req.user,
    body: req.body
  });

  const userId = req.user.id;

  const { restaurant_id, date, reservation_time, people_count } = req.body;

  if (!restaurant_id || !date || !reservation_time || !people_count) {
    console.error('[CREATE] Missing fields:', {
      restaurant_id: !!restaurant_id,
      date: !!date,
      reservation_time: !!reservation_time,
      people_count: !!people_count
    });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('[CREATE] Attempting DB insert with:', {
      user_id: userId,
      restaurant_id,
      date,
      reservation_time,
      people_count
    });

    const [result] = await pool.execute(
      'INSERT INTO reservations (user_id, restaurant_id, date, reservation_time, people_count) VALUES (?, ?, ?, ?, ?)',
      [userId, restaurant_id, date, reservation_time, people_count]
    );

    console.log('[CREATE] Insert successful. Result:', result);

    res.status(201).json({
      reservationId: result.insertId,
      userId,
      restaurant_id,
      date,
      reservation_time,
      people_count
    });
  } catch (error) {
    console.error('[CREATE] Database error:', {
      message: error.message,
      code: error.code,
      sql: error.sql
    });
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Enhanced GET endpoint
const getUserReservations = async (req, res) => {
  const userId = req.user.id;

  console.log('[GET] Request received for user:', userId);

  try {
    const [rows] = await pool.query(
      `SELECT r.*, res.name AS restaurant_name 
       FROM reservations r 
       LEFT JOIN restaurants res ON r.restaurant_id = res.restaurant_id 
       WHERE r.user_id = ?`,
      [userId]
    );

    console.log('[GET] Found reservations:', rows.length);

    if (rows.length === 0) {
      console.log('[GET] No reservations found for user:', userId);
      return res.status(404).json({ message: 'No reservations found for this user' });
    }

    res.json(rows);
  } catch (error) {
    console.error('[GET] Database error:', {
      message: error.message,
      code: error.code,
      sql: error.sql
    });
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get reservation by ID
const getReservationById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  console.log('[GET] Request received for reservation ID:', id);

  try {
    const [rows] = await pool.query(
      'SELECT r.*, res.name AS restaurant_name ' +
      'FROM reservations r ' +
      'LEFT JOIN restaurants res ON r.restaurant_id = res.restaurant_id ' +
      'WHERE r.reservation_id = ? AND r.user_id = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      console.warn('[GET] No reservation found or not owned by user');
      return res.status(404).json({ message: 'Reservation not found or not authorized' });
    }

    console.log('[GET] Reservation found:', rows[0]);
    res.json(rows[0]);
  } catch (error) {
    console.error('[GET] Database error:', {
      message: error.message,
      code: error.code,
      sql: error.sql
    });
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update reservation function
const updateReservation = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { date, reservation_time, people_count } = req.body;

  console.log('[UPDATE] Request received:', {
    reservationId: id,
    user: userId,
    body: req.body
  });

  if (!date || !reservation_time || !people_count) {
    console.error('[UPDATE] Missing fields:', {
      date: !!date,
      reservation_time: !!reservation_time,
      people_count: !!people_count
    });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('[UPDATE] Attempting update for reservation:', id);
    
    const [result] = await pool.execute(
      `UPDATE reservations 
       SET date = ?, reservation_time = ?, people_count = ? 
       WHERE reservation_id = ? AND user_id = ?`,
      [date, reservation_time, people_count, id, userId]
    );

    if (result.affectedRows === 0) {
      console.warn('[UPDATE] No reservation found or not owned by user');
      return res.status(404).json({ message: 'Reservation not found or not authorized' });
    }

    console.log('[UPDATE] Successfully updated reservation:', id);
    res.json({ message: 'Reservation updated successfully' });
  } catch (error) {
    console.error('[UPDATE] Database error:', {
      message: error.message,
      code: error.code,
      sql: error.sql
    });
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete reservation function
const deleteReservation = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  console.log('[DELETE] Request received:', {
    reservationId: id,
    user: userId
  });

  try {
    console.log('[DELETE] Attempting to delete reservation:', id);
    
    const [result] = await pool.execute(
      'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      console.warn('[DELETE] No reservation found or not owned by user');
      return res.status(404).json({ message: 'Reservation not found or not authorized' });
    }

    console.log('[DELETE] Successfully deleted reservation:', id);
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('[DELETE] Database error:', {
      message: error.message,
      code: error.code,
      sql: error.sql
    });
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Export all functions
module.exports = {
  createReservation,
  getUserReservations,
  updateReservation,
  deleteReservation,
  getReservationById
};