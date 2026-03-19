const { loadEnvFile } = require('node:process');
const path = require('node:path');
const express = require('express');
const session = require('express-session');
const { connectToMongo } = require('./db/mongo');
const { passport, configurePassport } = require('./config/passport');
const authRouter = require('./routes/auth');
const watchlistRouter = require('./routes/watchlist');

// Load local .env file if it exists
try {
  loadEnvFile();
} catch {
  // Ignore missing .env file
}

configurePassport();

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 7;

// Frontend build output directory
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

// Parse JSON request body
app.use(express.json());

// Session cookie middleware
app.use(
  session({
    name: 'sessionToken',
    secret: process.env.SESSION_SECRET || 'movie_tracker_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
      sameSite: 'lax',
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Backend API routes
app.use('/api/auth', authRouter);
app.use('/api/watchlist', watchlistRouter);

// Serve frontend static files
app.use(express.static(frontendDistPath));

// Start server
connectToMongo()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas');
    console.error(error);
  });