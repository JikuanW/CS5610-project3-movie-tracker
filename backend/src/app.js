import { loadEnvFile } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import session from 'express-session';
import { connectToMongo } from './db/mongo.js';
import { passport, configurePassport } from './config/passport.js';
import authRouter from './routes/auth.js';
import watchlistRouter from './routes/watchlist.js';

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
const SESSION_SECRET = process.env.SESSION_SECRET;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Frontend build output directory
const frontendDistPath = path.join(__dirname, '../../frontend/dist');

// Parse JSON request body
app.use(express.json());

if (!SESSION_SECRET) {
  throw new Error('SESSION_SECRET is missing');
}

// Session cookie middleware
app.use(
  session({
    name: 'sessionToken',
    secret: SESSION_SECRET,
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
