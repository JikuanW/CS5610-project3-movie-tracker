// Shared request helper
async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
  });

  const data = await response.json();

  return {
    response,
    data,
  };
}

// Get want-to-watch list
export function fetchWatchlistMovies() {
  return requestJson('/api/watchlist');
}

// Get watched list
export function fetchWatchedMovies() {
  return requestJson('/api/watchlist/watched');
}

// Get all movies
export function fetchAllMovies() {
  return requestJson('/api/watchlist/all-movies');
}

// Add to watchlist
export function addMovieToWatchlist(title) {
  return requestJson('/api/watchlist', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
}

// Remove movie from user list
export function removeMovieFromUserList(id) {
  return requestJson(`/api/watchlist/${id}`, {
    method: 'DELETE',
  });
}

// Mark as watched
export function markMovieAsWatched(id, rating, review) {
  return requestJson(`/api/watchlist/${id}/watched`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating, review }),
  });
}

// Update watched review
export function updateWatchedMovieReview(id, rating, review) {
  return requestJson(`/api/watchlist/${id}/review`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rating, review }),
  });
}

// Get movie reviews
export function fetchMovieReviews(movieId) {
  return requestJson(`/api/watchlist/all-movies/${movieId}/reviews`);
}

// Admin updates movie
export function updateAllMovie(movieId, payload) {
  return requestJson(`/api/watchlist/all-movies/${movieId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

// Admin deletes movie
export function deleteAllMovie(movieId) {
  return requestJson(`/api/watchlist/all-movies/${movieId}`, {
    method: 'DELETE',
  });
}