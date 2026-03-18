const { loadEnvFile } = require('node:process');
const express = require('express');
const { connectToMongo } = require('./db/mongo');
const authRouter = require('./routes/auth');
const watchlistRouter = require('./routes/watchlist');

// Load environment variables
loadEnvFile();

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON request body
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/watchlist', watchlistRouter);

// Start server
connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB Atlas');
    console.error(error);
  });