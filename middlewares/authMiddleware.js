const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, async (err, userPayload) => {
    if (err) {
      return res.sendStatus(403);
    }

    const user = await User.findByPk(userPayload.id, {raw: true});

    if (!user) {
      return res.sendStatus(401);
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;