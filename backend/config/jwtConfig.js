require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '1d',               // for jwt.sign()
  cookieMaxAge: 24 * 60 * 60 * 1000  // 1 day in milliseconds
};
