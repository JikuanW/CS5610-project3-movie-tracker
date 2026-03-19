import express from 'express';
import { passport } from '../config/passport.js';
import { getDb } from '../db/mongo.js';
import { hashPassword } from '../utils/password.js';

const router = express.Router();

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
router.post('/login', (req, res, next) => {
  const username = req.body.username ? req.body.username.trim() : '';
  const password = req.body.password || '';

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required',
    });
  }

  req.body.username = username;

  return passport.authenticate('local', (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        message:
          info && info.message ? info.message : 'Invalid username or password',
      });
    }

    return req.logIn(user, (loginError) => {
      if (loginError) {
        return next(loginError);
      }

      return res.json({
        message: 'Login successful',
        user: {
          id: user._id.toString(),
          username: user.username,
          role: user.role || 'user',
        },
      });
    });
  })(req, res, next);
});

// Current logged in user
router.get('/me', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }

  return res.json({
    user: {
      id: req.user._id.toString(),
      username: req.user.username,
      role: req.user.role || 'user',
    },
  });
});

// Logout
router.post('/logout', (req, res, next) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return next(logoutError);
    }

    if (!req.session) {
      return res.json({
        message: 'Logout successful',
      });
    }

    return req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie('sessionToken');

      return res.json({
        message: 'Logout successful',
      });
    });
  });
});

export default router;