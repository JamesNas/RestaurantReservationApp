const pool = require('../config/db.js');

class Reservation {
  constructor({ reservation_id, user_id, restaurant_id, date, reservation_time, people_count }) {
    this.reservation_id = reservation_id;
    this.user_id = user_id;
    this.restaurant_id = restaurant_id;
    this.date = date;
    this.reservation_time = reservation_time;
    this.people_count = people_count;
  }

  static async create({ user_id, restaurant_id, date, reservation_time, people_count }) {
    const [result] = await pool.query(
      'INSERT INTO reservations (user_id, restaurant_id, date, reservation_time, people_count) VALUES (?, ?, ?, ?, ?)',
      [user_id, restaurant_id, date, reservation_time, people_count]
    );

    const newReservation = await this.findById(result.insertId);
    return newReservation;
  }

  static async findById(reservation_id) {
    const [rows] = await pool.query(
      'SELECT * FROM reservations WHERE reservation_id = ?',
      [reservation_id]
    );
    return rows[0] ? new Reservation(rows[0]) : null;
  }

  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM reservations');
    return rows.map(row => new Reservation(row));
  }

  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      'SELECT * FROM reservations WHERE user_id = ?',
      [user_id]
    );
    return rows.map(row => new Reservation(row));
  }

  static async update(id, { date, reservation_time, people_count }) {
    await pool.query(
      'UPDATE reservations SET date = ?, reservation_time = ?, people_count = ? WHERE reservation_id = ?',
      [date, reservation_time, people_count, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM reservations WHERE reservation_id = ?', [id]);
    return { message: 'Reservation deleted successfully' };
  }
}

module.exports = Reservation;