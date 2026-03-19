import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo.js';

// Format user movie data
function formatUserMovie(movie, releaseYear) {
  return {
    id: movie._id.toString(),
    title: movie.title,
    genre: movie.genre,
    releaseYear,
    watchStatus: movie.watchStatus,
    rating: movie.rating,
    review: movie.review,
  };
}

// Read movie release year
async function getReleaseYear(movie, moviesCollection) {
  let releaseYear = movie.releaseYear;

  if (releaseYear === undefined || releaseYear === null) {
    const movieDoc = await moviesCollection.findOne({ _id: movie.movieId });
    releaseYear = movieDoc ? movieDoc.releaseYear : '';
  }

  return releaseYear;
}

// Build average rating map
function buildAverageRatingMap(watchedRatings) {
  const ratingMap = {};

  watchedRatings.forEach((movie) => {
    const movieId = movie.movieId.toString();
    const ratingNumber = Number(movie.rating);

    if (Number.isNaN(ratingNumber)) {
      return;
    }

    if (!ratingMap[movieId]) {
      ratingMap[movieId] = {
        sum: 0,
        count: 0,
      };
    }

    ratingMap[movieId].sum += ratingNumber;
    ratingMap[movieId].count += 1;
  });

  return ratingMap;
}

// Build user status map
function buildUserStatusMap(currentUserMovies) {
  const userStatusMap = {};

  currentUserMovies.forEach((movie) => {
    userStatusMap[movie.movieId.toString()] = movie.watchStatus;
  });

  return userStatusMap;
}

// Get user movies by status
async function getUserMoviesByStatus(userId, watchStatus) {
  const db = getDb();
  const userMovies = db.collection('userMovies');
  const moviesCollection = db.collection('movies');

  const userMovieList = await userMovies
    .find({
      userId,
      watchStatus,
    })
    .sort({ _id: -1 })
    .toArray();

  const movies = await Promise.all(
    userMovieList.map(async (movie) => {
      const releaseYear = await getReleaseYear(movie, moviesCollection);

      return formatUserMovie(movie, releaseYear);
    })
  );

  return movies;
}

// Get all movies list
async function getAllMoviesForUser(userId) {
  const db = getDb();
  const moviesCollection = db.collection('movies');
  const userMovies = db.collection('userMovies');

  const movieList = await moviesCollection.find({}).sort({ _id: -1 }).toArray();

  const watchedRatings = await userMovies
    .find({
      watchStatus: 'watched',
      rating: { $ne: '' },
    })
    .toArray();

  const currentUserMovies = await userMovies
    .find({
      userId,
    })
    .toArray();

  const ratingMap = buildAverageRatingMap(watchedRatings);
  const userStatusMap = buildUserStatusMap(currentUserMovies);

  return movieList.map((movie) => {
    const movieId = movie._id.toString();
    const ratingInfo = ratingMap[movieId];

    let averageRating = null;

    if (ratingInfo && ratingInfo.count > 0) {
      averageRating = Number((ratingInfo.sum / ratingInfo.count).toFixed(1));
    }

    return {
      id: movieId,
      title: movie.title,
      genre: movie.genre,
      description: movie.description,
      releaseYear: movie.releaseYear,
      averageRating,
      userStatus: userStatusMap[movieId] || 'notInList',
    };
  });
}

// Get movie reviews
async function getMovieReviews(movieId) {
  const db = getDb();
  const userMovies = db.collection('userMovies');
  const users = db.collection('users');

  const watchedMovies = await userMovies
    .find({
      movieId: new ObjectId(movieId),
      watchStatus: 'watched',
      review: { $ne: '' },
    })
    .sort({ _id: -1 })
    .toArray();

  const reviews = await Promise.all(
    watchedMovies.map(async (movie) => {
      const reviewUser = await users.findOne({ _id: movie.userId });

      return {
        id: movie._id.toString(),
        username: reviewUser ? reviewUser.username : 'Unknown user',
        rating: movie.rating,
        review: movie.review,
      };
    })
  );

  return reviews;
}

// Admin updates one movie
async function updateAllMovie(movieId, movieInput) {
  const db = getDb();
  const moviesCollection = db.collection('movies');
  const userMovies = db.collection('userMovies');
  const objectMovieId = new ObjectId(movieId);
  const { title, genre, description, releaseYear } = movieInput;

  const existingMovie = await moviesCollection.findOne({
    title,
    _id: { $ne: objectMovieId },
  });

  if (existingMovie) {
    return {
      type: 'duplicateTitle',
    };
  }

  const result = await moviesCollection.updateOne(
    {
      _id: objectMovieId,
    },
    {
      $set: {
        title,
        genre,
        description,
        releaseYear,
      },
    }
  );

  if (result.matchedCount === 0) {
    return {
      type: 'notFound',
    };
  }

  await userMovies.updateMany(
    {
      movieId: objectMovieId,
    },
    {
      $set: {
        title,
        genre,
        releaseYear,
      },
    }
  );

  return {
    type: 'success',
    movie: {
      id: movieId,
      title,
      genre,
      description,
      releaseYear,
    },
  };
}

// Admin deletes one movie
async function deleteAllMovie(movieId) {
  const db = getDb();
  const moviesCollection = db.collection('movies');
  const userMovies = db.collection('userMovies');
  const objectMovieId = new ObjectId(movieId);

  const result = await moviesCollection.deleteOne({
    _id: objectMovieId,
  });

  if (result.deletedCount === 0) {
    return {
      type: 'notFound',
    };
  }

  await userMovies.deleteMany({
    movieId: objectMovieId,
  });

  return {
    type: 'success',
  };
}

// Add movie to watchlist by title
async function addMovieToWatchlist(userId, title) {
  const db = getDb();
  const moviesCollection = db.collection('movies');
  const userMovies = db.collection('userMovies');

  const movie = await moviesCollection.findOne({ title });

  if (!movie) {
    return {
      type: 'movieNotFound',
    };
  }

  const existingUserMovie = await userMovies.findOne({
    userId,
    movieId: movie._id,
  });

  if (existingUserMovie) {
    return {
      type: 'alreadyExists',
    };
  }

  const result = await userMovies.insertOne({
    userId,
    movieId: movie._id,
    title: movie.title,
    genre: movie.genre,
    releaseYear: movie.releaseYear,
    watchStatus: 'wantToWatch',
    rating: '',
    review: '',
  });

  return {
    type: 'success',
    movie: {
      id: result.insertedId.toString(),
      title: movie.title,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      watchStatus: 'wantToWatch',
      rating: '',
      review: '',
    },
  };
}

// Create movie
async function createMovie(userId, movieInput, autoAddToWatchlist) {
  const db = getDb();
  const moviesCollection = db.collection('movies');
  const userMovies = db.collection('userMovies');
  const { title, genre, description, releaseYear } = movieInput;

  const existingMovie = await moviesCollection.findOne({ title });

  if (existingMovie) {
    return {
      type: 'alreadyExists',
    };
  }

  const movieResult = await moviesCollection.insertOne({
    title,
    genre,
    description,
    releaseYear,
  });

  const movieId = movieResult.insertedId;

  if (autoAddToWatchlist) {
    const userMovieResult = await userMovies.insertOne({
      userId,
      movieId,
      title,
      genre,
      releaseYear,
      watchStatus: 'wantToWatch',
      rating: '',
      review: '',
    });

    return {
      type: 'createdAndAdded',
      movie: {
        id: userMovieResult.insertedId.toString(),
        title,
        genre,
        description,
        releaseYear,
        watchStatus: 'wantToWatch',
        rating: '',
        review: '',
      },
    };
  }

  return {
    type: 'createdOnly',
    movie: {
      id: movieId.toString(),
      title,
      genre,
      description,
      releaseYear,
      averageRating: null,
    },
  };
}

// Move movie to watched list
async function moveMovieToWatched(userId, id, rating, review) {
  const db = getDb();
  const userMovies = db.collection('userMovies');

  const result = await userMovies.updateOne(
    {
      _id: new ObjectId(id),
      userId,
      watchStatus: 'wantToWatch',
    },
    {
      $set: {
        watchStatus: 'watched',
        rating,
        review,
      },
    }
  );

  if (result.matchedCount === 0) {
    return {
      type: 'notFound',
    };
  }

  return {
    type: 'success',
  };
}

// Update watched movie review
async function updateWatchedMovieReview(userId, id, rating, review) {
  const db = getDb();
  const userMovies = db.collection('userMovies');

  const result = await userMovies.updateOne(
    {
      _id: new ObjectId(id),
      userId,
      watchStatus: 'watched',
    },
    {
      $set: {
        rating,
        review,
      },
    }
  );

  if (result.matchedCount === 0) {
    return {
      type: 'notFound',
    };
  }

  return {
    type: 'success',
  };
}

// Delete one movie from user list
async function deleteUserMovie(userId, id) {
  const db = getDb();
  const userMovies = db.collection('userMovies');

  const result = await userMovies.deleteOne({
    _id: new ObjectId(id),
    userId,
  });

  if (result.deletedCount === 0) {
    return {
      type: 'notFound',
    };
  }

  return {
    type: 'success',
  };
}

export {
  getUserMoviesByStatus,
  getAllMoviesForUser,
  getMovieReviews,
  updateAllMovie,
  deleteAllMovie,
  addMovieToWatchlist,
  createMovie,
  moveMovieToWatched,
  updateWatchedMovieReview,
  deleteUserMovie,
};
