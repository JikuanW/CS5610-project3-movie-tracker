import PropTypes from 'prop-types';
import StarRatingInput from './StarRatingInput';
import './WatchlistTab.css';

// Want-to-watch tab
function WatchlistTab({
  title,
  onTitleChange,
  onAddMovie,
  message,
  movies,
  editingMovieId,
  rating,
  hoverRating,
  review,
  onOpenWatchedForm,
  onRemoveMovie,
  onHoverRatingChange,
  onRatingChange,
  onReviewChange,
  onMarkAsWatched,
  onCancelWatchedForm,
}) {
  return (
    <>
      <form className="watchlist-add-bar" onSubmit={onAddMovie}>
        <input
          type="text"
          placeholder="Enter movie title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
        <button type="submit">Add to Watchlist</button>
      </form>

      {message && <p className="watchlist-message">{message}</p>}

      <ul className="watchlist-list">
        {movies.map((movie) => (
          <li key={movie.id} className="watchlist-item movie-card">
            <div className="movie-card-main">
              <h3 className="movie-card-title">{movie.title}</h3>
              <p className="movie-card-meta">
                {movie.genre} · {movie.releaseYear}
              </p>
            </div>

            <div className="movie-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => onOpenWatchedForm(movie.id)}
              >
                Mark as Watched
              </button>

              <button
                type="button"
                className="remove-button"
                onClick={() => onRemoveMovie(movie.id)}
              >
                Remove
              </button>
            </div>

            {editingMovieId === movie.id && (
              <form
                className="watched-form"
                onSubmit={(event) => onMarkAsWatched(event, movie.id)}
              >
                <div className="watchlist-row">
                  <label>Rating</label>
                  <StarRatingInput
                    value={rating}
                    hoverValue={hoverRating}
                    onHoverChange={onHoverRatingChange}
                    onValueChange={onRatingChange}
                  />
                </div>

                <div className="watchlist-row">
                  <label htmlFor={`review-${movie.id}`}>Review</label>
                  <textarea
                    id={`review-${movie.id}`}
                    value={review}
                    onChange={(event) => onReviewChange(event.target.value)}
                  />
                </div>

                <div className="create-movie-actions">
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={onCancelWatchedForm}
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

const userMovieShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.string,
  releaseYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
});

WatchlistTab.propTypes = {
  title: PropTypes.string.isRequired,
  onTitleChange: PropTypes.func.isRequired,
  onAddMovie: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  movies: PropTypes.arrayOf(userMovieShape).isRequired,
  editingMovieId: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  hoverRating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  onOpenWatchedForm: PropTypes.func.isRequired,
  onRemoveMovie: PropTypes.func.isRequired,
  onHoverRatingChange: PropTypes.func.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  onReviewChange: PropTypes.func.isRequired,
  onMarkAsWatched: PropTypes.func.isRequired,
  onCancelWatchedForm: PropTypes.func.isRequired,
};

export default WatchlistTab;