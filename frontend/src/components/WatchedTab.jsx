import PropTypes from 'prop-types';
import StarRatingInput from './StarRatingInput';
import { renderStars } from '../utils/movieDisplay';
import './WatchedTab.css';

// Watched tab
function WatchedTab({
  message,
  movies,
  editingWatchedMovieId,
  watchedRating,
  watchedHoverRating,
  watchedReview,
  onOpenEditWatchedForm,
  onRemoveMovie,
  onWatchedHoverRatingChange,
  onWatchedRatingChange,
  onWatchedReviewChange,
  onUpdateWatchedMovie,
  onCancelEditWatchedForm,
}) {
  return (
    <>
      {message && <p className="watchlist-message">{message}</p>}

      <ul className="watchlist-list">
        {movies.map((movie) => (
          <li key={movie.id} className="watchlist-item movie-card">
            <div className="movie-card-main">
              <h3 className="movie-card-title">{movie.title}</h3>
              <p className="movie-card-meta">
                {movie.genre} · {movie.releaseYear}
              </p>
              <p className="movie-card-detail">
                <span className="movie-card-label">Rating:</span>{' '}
                {renderStars(movie.rating)}
              </p>
              <p className="movie-card-detail">
                <span className="movie-card-label">Review:</span> {movie.review}
              </p>
            </div>

            <div className="movie-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onOpenEditWatchedForm(movie)}
              >
                Edit
              </button>

              <button
                type="button"
                className="remove-button"
                onClick={() => onRemoveMovie(movie.id)}
              >
                Remove
              </button>
            </div>

            {editingWatchedMovieId === movie.id && (
              <form
                className="watched-form"
                onSubmit={(event) => onUpdateWatchedMovie(event, movie.id)}
              >
                <div className="watchlist-row">
                  <label>Rating</label>
                  <StarRatingInput
                    value={watchedRating}
                    hoverValue={watchedHoverRating}
                    onHoverChange={onWatchedHoverRatingChange}
                    onValueChange={onWatchedRatingChange}
                  />
                </div>

                <div className="watchlist-row">
                  <label htmlFor={`watched-review-${movie.id}`}>Review</label>
                  <textarea
                    id={`watched-review-${movie.id}`}
                    value={watchedReview}
                    onChange={(event) =>
                      onWatchedReviewChange(event.target.value)
                    }
                  />
                </div>

                <div className="create-movie-actions">
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancelEditWatchedForm}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

const watchedMovieShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.string,
  releaseYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  review: PropTypes.string,
});

WatchedTab.propTypes = {
  message: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(watchedMovieShape).isRequired,
  editingWatchedMovieId: PropTypes.string.isRequired,
  watchedRating: PropTypes.string.isRequired,
  watchedHoverRating: PropTypes.number.isRequired,
  watchedReview: PropTypes.string.isRequired,
  onOpenEditWatchedForm: PropTypes.func.isRequired,
  onRemoveMovie: PropTypes.func.isRequired,
  onWatchedHoverRatingChange: PropTypes.func.isRequired,
  onWatchedRatingChange: PropTypes.func.isRequired,
  onWatchedReviewChange: PropTypes.func.isRequired,
  onUpdateWatchedMovie: PropTypes.func.isRequired,
  onCancelEditWatchedForm: PropTypes.func.isRequired,
};

export default WatchedTab;
