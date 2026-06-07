const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (userId, username, email) => {
  return jwt.sign(
    { userId, username, email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateUsername = (username) => {
  return username && username.length >= 3 && username.length <= 30;
};

module.exports = {
  generateToken,
  validateEmail,
  validateUsername,
};
