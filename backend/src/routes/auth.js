const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, validateEmail, validateUsername } = require('../utils/helpers');

router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  // Validation
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!validateUsername(username)) {
    return res.status(400).json({ error: 'Username must be 3-30 characters' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if user exists
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUsername = await User.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Create user
    const user = await User.create(email, username, password);
    const token = generateToken(user.id, username, email);

    res.status(201).json({
      user,
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await User.verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.username, user.email);
    const userData = { id: user.id, email: user.email, username: user.username };

    res.json({
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
