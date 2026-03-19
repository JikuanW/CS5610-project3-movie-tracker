import { loadEnvFile } from 'node:process';
import { MongoClient } from 'mongodb';

// Load environment variables
loadEnvFile();

// Movie genre list
const GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

// Description template list
const DESCRIPTION_TEMPLATES = [
  'A movie about love and family.',
  'A movie about adventure and action.',
  'A movie about challenges and growth.',
];

// Create one movie record
function createMovie(index) {
  const genre = GENRES[(index - 1) % GENRES.length];
  const description =
    DESCRIPTION_TEMPLATES[(index - 1) % DESCRIPTION_TEMPLATES.length];
  const releaseYear = 1980 + ((index - 1) % 45);

  return {
    title: `Synthetic Movie ${index}`,
    genre,
    description,
    releaseYear,
  };
}

// Main function
async function seedMovies() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'movie_tracker';

  if (!uri) {
    throw new Error('MONGODB_URI is missing');
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    const movies = db.collection('movies');

    // Make sure unique title index exists
    await movies.createIndex({ title: 1 }, { unique: true });

    // Generate target movie titles
    const targetTitles = [];

    for (let i = 1; i <= 1200; i += 1) {
      targetTitles.push(`Synthetic Movie ${i}`);
    }

    // Find existing seeded movies
    const existingMovies = await movies
      .find(
        {
          title: { $in: targetTitles },
        },
        {
          projection: { title: 1 },
        }
      )
      .toArray();

    const existingTitleSet = new Set(
      existingMovies.map((movie) => movie.title)
    );

    // Insert only missing movies
    const moviesToInsert = [];

    for (let i = 1; i <= 1200; i += 1) {
      const title = `Synthetic Movie ${i}`;

      if (!existingTitleSet.has(title)) {
        moviesToInsert.push(createMovie(i));
      }
    }

    if (moviesToInsert.length > 0) {
      await movies.insertMany(moviesToInsert);
    }

    const seededCount = await movies.countDocuments({
      title: { $in: targetTitles },
    });

    console.log(`Synthetic movies in database: ${seededCount}`);
    console.log(`Inserted this time: ${moviesToInsert.length}`);
    console.log('Movie seed completed successfully');
  } finally {
    await client.close();
  }
}

// Run script
seedMovies().catch((error) => {
  console.error('Failed to seed movies');
  console.error(error);
  process.exit(1);
});
