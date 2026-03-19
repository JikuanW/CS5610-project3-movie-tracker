import PropTypes from 'prop-types';
import Pagination from './Pagination';
import { MOVIE_GENRES } from '../constants/movieGenres';
import {
  formatAverageRating,
  formatUserStatus,
  renderAverageStars,
  renderStars,
} from '../utils/movieDisplay';
import './AllMoviesTab.css';

// All movies tab
function AllMoviesTab({
  user,
  message,
  onOpenCreateMovie,
  searchKeyword,
  onSearchKeywordChange,
  selectedGenre,
  genreOptions,
  onSelectedGenreChange,
  movieStatusFilter,
  onMovieStatusFilterChange,
  selectedDisplayedRating,
  onSelectedDisplayedRatingChange,
  sortOption,
  onSortOptionChange,
  moviesPerPage,
  onMoviesPerPageChange,
  movies,
  openReviewsMovieId,
  movieReviews,
  onAddMovieFromAllMovies,
  onViewReviews,
  editingAllMovieId,
  editingAllMovieTitle,
  onEditingAllMovieTitleChange,
  editingAllMovieGenre,
  onEditingAllMovieGenreChange,
  editingAllMovieDescription,
  onEditingAllMovieDescriptionChange,
  editingAllMovieReleaseYear,
  onEditingAllMovieReleaseYearChange,
  onOpenEditAllMovieForm,
  onDeleteAllMovie,
  onUpdateAllMovie,
  onCancelEditAllMovieForm,
  totalMovies,
  startIndex,
  endIndex,
  safeCurrentPage,
  totalPages,
  visiblePageNumbers,
  onPageChange,
}) {
  return (
    <>
      <div className="all-movies-toolbar">
        <div className="all-movies-top-row">
          <input
            type="text"
            className="all-movies-search-input"
            placeholder="Search by title"
            value={searchKeyword}
            onChange={(event) => onSearchKeywordChange(event.target.value)}
          />

          <button
            type="button"
            className="all-movies-add-button"
            onClick={() => onOpenCreateMovie('', 'allMovies', false)}
          >
            Add New Movie
          </button>
        </div>

        <div className="all-movies-filter-row">
          <select
            value={selectedGenre}
            onChange={(event) => onSelectedGenreChange(event.target.value)}
          >
            <option value="">All Genres</option>
            {genreOptions.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <select
            value={movieStatusFilter}
            onChange={(event) => onMovieStatusFilterChange(event.target.value)}
          >
            <option value="all">Show All</option>
            <option value="notWatchedYet">Not Watched Yet</option>
            <option value="notInYourList">Not in Your List</option>
          </select>

          <select
            value={selectedDisplayedRating}
            onChange={(event) =>
              onSelectedDisplayedRatingChange(event.target.value)
            }
          >
            <option value="">All Ratings</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>

          <select
            value={sortOption}
            onChange={(event) => onSortOptionChange(event.target.value)}
          >
            <option value="">No Sorting</option>
            <option value="yearNewest">Newest Year First</option>
            <option value="ratingHighest">Highest Rating First</option>
          </select>

          <select
            value={String(moviesPerPage)}
            onChange={(event) =>
              onMoviesPerPageChange(Number(event.target.value))
            }
          >
            <option value="12">12 per page</option>
            <option value="24">24 per page</option>
            <option value="48">48 per page</option>
          </select>
        </div>
      </div>

      {message && <p className="watchlist-message">{message}</p>}

      <ul className="watchlist-list">
        {movies.map((movie) => {
          const isAlreadyInUserList = movie.userStatus !== 'notInList';
          const hasAverageRating =
            movie.averageRating !== null &&
            movie.averageRating !== undefined &&
            !Number.isNaN(Number(movie.averageRating));

          return (
            <li key={movie.id} className="watchlist-item movie-card">
              <div className="movie-card-main">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-meta">
                  {movie.genre} · {movie.releaseYear}
                </p>
                <p className="movie-card-description">{movie.description}</p>

                {hasAverageRating ? (
                  <p className="movie-card-rating-line">
                    <span className="movie-card-stars">
                      {renderAverageStars(movie.averageRating)}
                    </span>
                    <span className="movie-card-average">
                      {formatAverageRating(movie.averageRating)}
                    </span>
                  </p>
                ) : (
                  <p className="movie-card-no-rating">No ratings yet</p>
                )}

                <p className="movie-card-status-inline">
                  ({formatUserStatus(movie.userStatus)})
                </p>
              </div>

              <div className="movie-actions">
                <button
                  type="button"
                  className="secondary-button"
                  disabled={isAlreadyInUserList}
                  onClick={() => onAddMovieFromAllMovies(movie.title)}
                >
                  Add to Watchlist
                </button>

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => onViewReviews(movie.id)}
                >
                  {openReviewsMovieId === movie.id
                    ? 'Hide Reviews'
                    : 'View Reviews'}
                </button>

                {user && user.role === 'admin' && (
                  <>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => onOpenEditAllMovieForm(movie)}
                    >
                      Edit Movie
                    </button>

                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => onDeleteAllMovie(movie.id)}
                    >
                      Delete Movie
                    </button>
                  </>
                )}
              </div>

              {editingAllMovieId === movie.id && (
                <form
                  className="watched-form"
                  onSubmit={(event) => onUpdateAllMovie(event, movie.id)}
                >
                  <div className="watchlist-row">
                    <label htmlFor={`edit-title-${movie.id}`}>
                      Movie Title
                    </label>
                    <input
                      id={`edit-title-${movie.id}`}
                      type="text"
                      value={editingAllMovieTitle}
                      onChange={(event) =>
                        onEditingAllMovieTitleChange(event.target.value)
                      }
                    />
                  </div>

                  <div className="watchlist-row">
                    <label htmlFor={`edit-genre-${movie.id}`}>Genre</label>
                    <select
                      id={`edit-genre-${movie.id}`}
                      value={editingAllMovieGenre}
                      onChange={(event) =>
                        onEditingAllMovieGenreChange(event.target.value)
                      }
                    >
                      {MOVIE_GENRES.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="watchlist-row">
                    <label htmlFor={`edit-description-${movie.id}`}>
                      Description
                    </label>
                    <textarea
                      id={`edit-description-${movie.id}`}
                      value={editingAllMovieDescription}
                      onChange={(event) =>
                        onEditingAllMovieDescriptionChange(event.target.value)
                      }
                    />
                  </div>

                  <div className="watchlist-row">
                    <label htmlFor={`edit-release-year-${movie.id}`}>
                      Release Year
                    </label>
                    <input
                      id={`edit-release-year-${movie.id}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      value={editingAllMovieReleaseYear}
                      onChange={onEditingAllMovieReleaseYearChange}
                    />
                  </div>

                  <div className="create-movie-actions">
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={onCancelEditAllMovieForm}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {openReviewsMovieId === movie.id && (
                <div className="watched-form">
                  <div className="movie-info">
                    <p>
                      <strong>All Reviews:</strong>
                    </p>
                  </div>

                  {movieReviews.length === 0 && (
                    <p className="watchlist-message">No reviews yet</p>
                  )}

                  {movieReviews.length > 0 && (
                    <ul className="watchlist-list">
                      {movieReviews.map((item) => (
                        <li
                          key={item.id}
                          className="watchlist-item movie-card review-card"
                        >
                          <div className="movie-card-main">
                            <p className="movie-card-detail">
                              <span className="movie-card-label">User:</span>{' '}
                              {item.username}
                            </p>
                            <p className="movie-card-detail">
                              <span className="movie-card-label">Rating:</span>{' '}
                              {renderStars(item.rating)}
                            </p>
                            <p className="movie-card-detail">
                              <span className="movie-card-label">Review:</span>{' '}
                              {item.review}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Pagination
        totalMovies={totalMovies}
        startIndex={startIndex}
        endIndex={endIndex}
        safeCurrentPage={safeCurrentPage}
        totalPages={totalPages}
        visiblePageNumbers={visiblePageNumbers}
        onPageChange={onPageChange}
      />
    </>
  );
}

const allMovieShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  genre: PropTypes.string,
  description: PropTypes.string,
  releaseYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  averageRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  userStatus: PropTypes.string,
});

const movieReviewShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  review: PropTypes.string,
});

AllMoviesTab.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string,
  }).isRequired,
  message: PropTypes.string.isRequired,
  onOpenCreateMovie: PropTypes.func.isRequired,
  searchKeyword: PropTypes.string.isRequired,
  onSearchKeywordChange: PropTypes.func.isRequired,
  selectedGenre: PropTypes.string.isRequired,
  genreOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectedGenreChange: PropTypes.func.isRequired,
  movieStatusFilter: PropTypes.string.isRequired,
  onMovieStatusFilterChange: PropTypes.func.isRequired,
  selectedDisplayedRating: PropTypes.string.isRequired,
  onSelectedDisplayedRatingChange: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
  onSortOptionChange: PropTypes.func.isRequired,
  moviesPerPage: PropTypes.number.isRequired,
  onMoviesPerPageChange: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(allMovieShape).isRequired,
  openReviewsMovieId: PropTypes.string.isRequired,
  movieReviews: PropTypes.arrayOf(movieReviewShape).isRequired,
  onAddMovieFromAllMovies: PropTypes.func.isRequired,
  onViewReviews: PropTypes.func.isRequired,
  editingAllMovieId: PropTypes.string.isRequired,
  editingAllMovieTitle: PropTypes.string.isRequired,
  onEditingAllMovieTitleChange: PropTypes.func.isRequired,
  editingAllMovieGenre: PropTypes.string.isRequired,
  onEditingAllMovieGenreChange: PropTypes.func.isRequired,
  editingAllMovieDescription: PropTypes.string.isRequired,
  onEditingAllMovieDescriptionChange: PropTypes.func.isRequired,
  editingAllMovieReleaseYear: PropTypes.string.isRequired,
  onEditingAllMovieReleaseYearChange: PropTypes.func.isRequired,
  onOpenEditAllMovieForm: PropTypes.func.isRequired,
  onDeleteAllMovie: PropTypes.func.isRequired,
  onUpdateAllMovie: PropTypes.func.isRequired,
  onCancelEditAllMovieForm: PropTypes.func.isRequired,
  totalMovies: PropTypes.number.isRequired,
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  safeCurrentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  visiblePageNumbers: PropTypes.arrayOf(PropTypes.number).isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default AllMoviesTab;
