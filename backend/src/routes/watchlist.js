const express = require('express');
const {
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
} = require('../controllers/watchlistController');
const { requireLogin, requireAdmin } = require('../middlewares/auth');

const router = express.Router();

// Current user's want-to-watch list
router.get('/', requireLogin, getWatchlist);

// Current user's watched list
router.get('/watched', requireLogin, getWatchedList);

// All movies list
router.get('/all-movies', requireLogin, getAllMovies);

// All reviews of one movie
router.get('/all-movies/:movieId/reviews', requireLogin, getAllMovieReviews);

// Admin updates one movie
router.patch(
  '/all-movies/:movieId',
  requireLogin,
  requireAdmin,
  updateAllMovieByAdmin
);

// Admin deletes one movie
router.delete(
  '/all-movies/:movieId',
  requireLogin,
  requireAdmin,
  deleteAllMovieByAdmin
);

// Add to watchlist by title
router.post('/', requireLogin, addMovie);

// Create movie
router.post('/create-movie', requireLogin, createNewMovie);

// Move want-to-watch movie to watched
router.patch('/:id/watched', requireLogin, markMovieAsWatched);

// Update watched movie rating and review
router.patch('/:id/review', requireLogin, updateMovieReview);

// Remove movie from user's list
router.delete('/:id', requireLogin, removeMovie);

module.exports = router;