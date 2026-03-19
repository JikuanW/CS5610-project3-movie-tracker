import { MongoClient } from 'mongodb';
import { hashPassword } from '../utils/password.js';

// Database connection objects
let client;
let database;

// Create or update admin account
async function ensureAdminUser(db) {
  const users = db.collection('users');
  const adminPasswordHash = hashPassword('admin');
  const adminUser = await users.findOne({ username: 'admin' });

  if (!adminUser) {
    await users.insertOne({
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'admin',
      createdAt: new Date(),
    });

    return;
  }

  await users.updateOne(
    { _id: adminUser._id },
    {
      $set: {
        passwordHash: adminPasswordHash,
        role: 'admin',
      },
    }
  );
}

// Connect to MongoDB Atlas
async function connectToMongo() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'movie_tracker';

  if (!uri) {
    throw new Error('MONGODB_URI is missing');
  }

  if (!database) {
    client = new MongoClient(uri);
    await client.connect();
    database = client.db(dbName);

    // Create indexes
    await database
      .collection('movies')
      .createIndex({ title: 1 }, { unique: true });

    await database
      .collection('userMovies')
      .createIndex({ userId: 1, movieId: 1 }, { unique: true });

    // Make sure admin account exists
    await ensureAdminUser(database);
  }

  return database;
}

// Get database instance
function getDb() {
  if (!database) {
    throw new Error('Database is not connected');
  }

  return database;
}

export { connectToMongo, getDb };
