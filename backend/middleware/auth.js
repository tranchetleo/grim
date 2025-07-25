const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error('Authorization header missing');

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'RANDOM_SECRET_KEY');
    req.auth = { userId: decodedToken.userId };

    next();
  } catch (err) {
    res.status(401).json({ error: 'Requête non authentifiée' });
  }
};
