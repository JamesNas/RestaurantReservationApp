const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, jwtConfig.secret);
      req.user = user;
      return next();
    } catch (err) {
      console.error('JWT verification error:', err); // Log the error for debugging
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  return res.status(401).json({ error: 'Authentication required' });
};