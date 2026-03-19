import {
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
} from '../services/watchlistService.js';
import {
  getTrimmedText,
  isValidObjectId,
  getMovieInput,
  validateMovieInput,
  getReviewInput,
  validateReviewInput,
} from '../validators/watchlistValidators.js';

// Get want-to-watch list
async function getWatchlist(req, res) {
  const movies = await getUserMoviesByStatus(
    req.currentUser._id,
    'wantToWatch'
  );

  return res.json({ movies });
}

// Get watched list
async function getWatchedList(req, res) {
  const movies = await getUserMoviesByStatus(req.currentUser._id, 'watched');

  return res.json({ movies });
}

// Get all movies
async function getAllMovies(req, res) {
  const movies = await getAllMoviesForUser(req.currentUser._id);

  return res.json({ movies });
}

// Get movie reviews
async function getAllMovieReviews(req, res) {
  const movieId = req.params.movieId;

  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      message: 'Invalid movie id',
    });
  }

  const reviews = await getMovieReviews(movieId);

  return res.json({ reviews });
}

// Admin updates movie
async function updateAllMovieByAdmin(req, res) {
  const movieId = req.params.movieId;

  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      message: 'Invalid movie id',
    });
  }

  const movieInput = getMovieInput(req.body);
  const validationResult = validateMovieInput(movieInput);

  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message,
    });
  }

  const result = await updateAllMovie(movieId, validationResult.value);

  if (result.type === 'duplicateTitle') {
    return res.status(400).json({
      message: 'Movie title already exists',
    });
  }

  if (result.type === 'notFound') {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  return res.json({
    message: 'Movie updated successfully',
    movie: result.movie,
  });
}

// Admin deletes movie
async function deleteAllMovieByAdmin(req, res) {
  const movieId = req.params.movieId;

  if (!isValidObjectId(movieId)) {
    return res.status(400).json({
      message: 'Invalid movie id',
    });
  }

  const result = await deleteAllMovie(movieId);

  if (result.type === 'notFound') {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  return res.json({
    message: 'Movie deleted successfully',
  });
}

// Add movie by title
async function addMovie(req, res) {
  const title = getTrimmedText(req.body.title);

  if (!title) {
    return res.status(400).json({
      message: 'Title is required',
    });
  }

  const result = await addMovieToWatchlist(req.currentUser._id, title);

  if (result.type === 'movieNotFound') {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  if (result.type === 'alreadyExists') {
    return res.status(400).json({
      message: 'Movie already exists in your list',
    });
  }

  return res.status(201).json({
    message: 'Movie added to watchlist',
    movie: result.movie,
  });
}

// Create movie
async function createNewMovie(req, res) {
  const movieInput = getMovieInput(req.body);
  const validationResult = validateMovieInput(movieInput);
  const autoAddToWatchlist = Boolean(req.body.autoAddToWatchlist);

  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message,
    });
  }

  const result = await createMovie(
    req.currentUser._id,
    validationResult.value,
    autoAddToWatchlist
  );

  if (result.type === 'alreadyExists') {
    return res.status(400).json({
      message: 'Movie already exists',
    });
  }

  if (result.type === 'createdAndAdded') {
    return res.status(201).json({
      message: 'Movie created and added to watchlist',
      movie: result.movie,
    });
  }

  return res.status(201).json({
    message: 'Movie created successfully',
    movie: result.movie,
  });
}

// Move want-to-watch movie to watched
async function markMovieAsWatched(req, res) {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid id',
    });
  }

  const reviewInput = getReviewInput(req.body);
  const validationResult = validateReviewInput(reviewInput);

  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message,
    });
  }

  const result = await moveMovieToWatched(
    req.currentUser._id,
    id,
    validationResult.value.rating,
    validationResult.value.review
  );

  if (result.type === 'notFound') {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  return res.json({
    message: 'Movie moved to watched list',
  });
}

// Update watched movie review
async function updateMovieReview(req, res) {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid id',
    });
  }

  const reviewInput = getReviewInput(req.body);
  const validationResult = validateReviewInput(reviewInput);

  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message,
    });
  }

  const result = await updateWatchedMovieReview(
    req.currentUser._id,
    id,
    validationResult.value.rating,
    validationResult.value.review
  );

  if (result.type === 'notFound') {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  return res.json({
    message: 'Watched movie updated',
  });
}

// Delete user movie
async function removeMovie(req, res) {
  const id = req.params.id;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid id',
    });
  }

  const result = await deleteUserMovie(req.currentUser._id, id);

  if (result.type === 'notFound') {
    return res.status(404).json({
      message: 'Movie not found',
    });
  }

  return res.json({
    message: 'Movie removed',
  });
}

export {
  getWatchlist,
  getWatchedList,
  getAllMovies,
  getAllMovieReviews,
  updateAllMovieByAdmin,
  deleteAllMovieByAdmin,
  addMovie,
  createNewMovie,
  markMovieAsWatched,
  updateMovieReview,
  removeMovie,
};
