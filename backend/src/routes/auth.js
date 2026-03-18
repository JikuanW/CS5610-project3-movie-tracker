const express = require('express');
const { getDb } = require('../db/mongo');
const { hashPassword, verifyPassword } = require('../utils/password');
const { createSessionToken, getSessionToken } = require('../utils/session');

const router = express.Router();
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

// Register
router.post('/register', async (req, res) => {
  const username = req.body.username ? req.body.username.trim() : '';
  const password = req.body.password || '';

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required',
    });
  }

  const db = getDb();
  const users = db.collection('users');

  const existingUser = await users.findOne({ username });

  if (existingUser) {
    return res.status(400).json({
      message: 'Username already exists',
    });
  }

  const passwordHash = hashPassword(password);

  await users.insertOne({
    username,
    passwordHash,
    role: 'user',
    createdAt: new Date(),
  });

  return res.status(201).json({
    message: 'Register successful',
  });
});

// Login
router.post('/login', async (req, res) => {
  const username = req.body.username ? req.body.username.trim() : '';
  const password = req.body.password || '';

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required',
    });
  }

  const db = getDb();
  const users = db.collection('users');
  const sessions = db.collection('sessions');

  const user = await users.findOne({ username });

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({
      message: 'Invalid username or password',
    });
  }

  const sessionToken = createSessionToken();

  await sessions.insertOne({
    token: sessionToken,
    userId: user._id,
    createdAt: new Date(),
  });

  res.setHeader(
    'Set-Cookie',
    `sessionToken=${sessionToken}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE}; SameSite=Lax`
  );

  return res.json({
    message: 'Login successful',
    user: {
      id: user._id.toString(),
      username: user.username,
      role: user.role || 'user',
    },
  });
});

// Current logged in user
router.get('/me', async (req, res) => {
  const sessionToken = getSessionToken(req);

  if (!sessionToken) {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }

  const db = getDb();
  const sessions = db.collection('sessions');
  const users = db.collection('users');

  const session = await sessions.findOne({ token: sessionToken });

  if (!session) {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }

  const user = await users.findOne({ _id: session.userId });

  if (!user) {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }

  return res.json({
    user: {
      id: user._id.toString(),
      username: user.username,
      role: user.role || 'user',
    },
  });
});

// Logout
router.post('/logout', async (req, res) => {
  const sessionToken = getSessionToken(req);
  const db = getDb();
  const sessions = db.collection('sessions');

  if (sessionToken) {
    await sessions.deleteOne({ token: sessionToken });
  }

  res.setHeader(
    'Set-Cookie',
    'sessionToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax'
  );

  return res.json({
    message: 'Logout successful',
  });
});

module.exports = router;