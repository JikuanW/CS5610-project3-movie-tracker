import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import WatchlistTab from './WatchlistTab';
import WatchedTab from './WatchedTab';
import AllMoviesTab from './AllMoviesTab';
import {
  addMovieToWatchlist,
  deleteAllMovie,
  fetchAllMovies,
  fetchMovieReviews,
  fetchWatchlistMovies,
  fetchWatchedMovies,
  markMovieAsWatched,
  removeMovieFromUserList,
  updateAllMovie,
  updateWatchedMovieReview,
} from '../api/watchlistApi';
import { getVisiblePageNumbers } from '../utils/movieDisplay';
import './WatchlistPage.css';

// Movie list component
function WatchlistPage({ user, onOpenCreateMovie, initialTab }) {
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab || 'watchlist');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [editingMovieId, setEditingMovieId] = useState('');
  const [editingWatchedMovieId, setEditingWatchedMovieId] = useState('');
  const [editingAllMovieId, setEditingAllMovieId] = useState('');
  const [editingAllMovieTitle, setEditingAllMovieTitle] = useState('');
  const [editingAllMovieGenre, setEditingAllMovieGenre] = useState('Action');
  const [editingAllMovieDescription, setEditingAllMovieDescription] =
    useState('');
  const [editingAllMovieReleaseYear, setEditingAllMovieReleaseYear] =
    useState('');
  const [rating, setRating] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [watchedRating, setWatchedRating] = useState('');
  const [watchedHoverRating, setWatchedHoverRating] = useState(0);
  const [watchedReview, setWatchedReview] = useState('');
  const [openReviewsMovieId, setOpenReviewsMovieId] = useState('');
  const [movieReviews, setMovieReviews] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedDisplayedRating, setSelectedDisplayedRating] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [movieStatusFilter, setMovieStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage, setMoviesPerPage] = useState(12);

  // Keep only 4-digit year input
  function handleEditAllMovieReleaseYearChange(event) {
    const value = event.target.value.replace(/\D/g, '').slice(0, 4);
    setEditingAllMovieReleaseYear(value);
  }

  // Reset want-to-watch form state
  function resetWatchlistEditState() {
    setEditingMovieId('');
    setRating('');
    setHoverRating(0);
    setReview('');
  }

  // Reset watched edit state
  function resetWatchedEditState() {
    setEditingWatchedMovieId('');
    setWatchedRating('');
    setWatchedHoverRating(0);
    setWatchedReview('');
  }

  // Reset all movies edit state
  function resetAllMoviesEditState() {
    setEditingAllMovieId('');
    setEditingAllMovieTitle('');
    setEditingAllMovieGenre('Action');
    setEditingAllMovieDescription('');
    setEditingAllMovieReleaseYear('');
  }

  // Reset review panel state
  function resetReviewState() {
    setOpenReviewsMovieId('');
    setMovieReviews([]);
  }

  // Load all three lists
  async function loadLists() {
    const [watchlistResult, watchedResult, allMoviesResult] = await Promise.all(
      [fetchWatchlistMovies(), fetchWatchedMovies(), fetchAllMovies()]
    );

    if (!watchlistResult.response.ok) {
      return {
        ok: false,
        message: watchlistResult.data.message,
      };
    }

    if (!watchedResult.response.ok) {
      return {
        ok: false,
        message: watchedResult.data.message,
      };
    }

    if (!allMoviesResult.response.ok) {
      return {
        ok: false,
        message: allMoviesResult.data.message,
      };
    }

    return {
      ok: true,
      watchlistMovies: watchlistResult.data.movies,
      watchedMovies: watchedResult.data.movies,
      allMovies: allMoviesResult.data.movies,
    };
  }

  // Apply loaded list data
  function applyListData(result) {
    setWatchlistMovies(result.watchlistMovies);
    setWatchedMovies(result.watchedMovies);
    setAllMovies(result.allMovies);
  }

  // Refresh three lists
  async function refreshLists() {
    const result = await loadLists();

    if (!result.ok) {
      setMessage(result.message);
      return false;
    }

    setMessage('');
    applyListData(result);
    return true;
  }

  // Load three lists on page load
  useEffect(() => {
    let cancelled = false;

    loadLists()
      .then((result) => {
        if (cancelled) {
          return;
        }

        if (!result.ok) {
          setMessage(result.message);
          return;
        }

        setMessage('');
        applyListData(result);
      })
      .catch(() => {
        if (!cancelled) {
          setMessage('Failed to load movie lists');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Add movie to watchlist
  async function handleAddMovie(event) {
    event.preventDefault();

    const { response, data } = await addMovieToWatchlist(title);

    if (response.status === 404) {
      onOpenCreateMovie(title, 'watchlist', true);
      return;
    }

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(data.message);
    setTitle('');
    await refreshLists();
  }

  // Add movie to watchlist from all movies list
  async function handleAddMovieFromAllMovies(movieTitle) {
    const { response, data } = await addMovieToWatchlist(movieTitle);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(data.message);
    await refreshLists();
  }

  // Remove movie from user's list
  async function handleRemoveMovie(id) {
    const { response, data } = await removeMovieFromUserList(id);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(data.message);
    resetWatchlistEditState();
    resetWatchedEditState();
    await refreshLists();
  }

  // Admin removes movie from all movies list
  async function handleDeleteAllMovie(movieId) {
    const { response, data } = await deleteAllMovie(movieId);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(data.message);
    resetReviewState();
    resetAllMoviesEditState();
    await refreshLists();
  }

  // View all reviews for one movie
  async function handleViewReviews(movieId) {
    if (openReviewsMovieId === movieId) {
      resetReviewState();
      return;
    }

    const { response, data } = await fetchMovieReviews(movieId);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage('');
    setOpenReviewsMovieId(movieId);
    setMovieReviews(data.reviews);
  }

  // Open watched form for watchlist movie
  function handleOpenWatchedForm(id) {
    setEditingMovieId(id);
    resetWatchedEditState();
    resetAllMoviesEditState();
    resetReviewState();
    setMessage('');
  }

  // Submit watched movie info
  async function handleMarkAsWatched(event, id) {
    event.preventDefault();

    const { response, data } = await markMovieAsWatched(id, rating, review);

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage('');
    resetWatchlistEditState();
    setActiveTab('watched');
    await refreshLists();
  }

  // Open edit form for watched movie
  function handleOpenEditWatchedForm(movie) {
    setEditingWatchedMovieId(movie.id);
    resetWatchlistEditState();
    resetAllMoviesEditState();
    resetReviewState();
    setWatchedRating(movie.rating || '');
    setWatchedHoverRating(0);
    setWatchedReview(movie.review || '');
    setMessage('');
  }

  // Submit watched movie edit
  async function handleUpdateWatchedMovie(event, id) {
    event.preventDefault();

    const { response, data } = await updateWatchedMovieReview(
      id,
      watchedRating,
      watchedReview
    );

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage('');
    resetWatchedEditState();
    await refreshLists();
  }

  // Open edit form for all movies
  function handleOpenEditAllMovieForm(movie) {
    setEditingAllMovieId(movie.id);
    resetWatchlistEditState();
    resetWatchedEditState();
    resetReviewState();
    setEditingAllMovieTitle(movie.title || '');
    setEditingAllMovieGenre(movie.genre || 'Action');
    setEditingAllMovieDescription(movie.description || '');
    setEditingAllMovieReleaseYear(String(movie.releaseYear || ''));
    setMessage('');
  }

  // Submit all movies edit
  async function handleUpdateAllMovie(event, movieId) {
    event.preventDefault();

    if (!/^\d{4}$/.test(editingAllMovieReleaseYear)) {
      setMessage('Release year must be exactly 4 digits');
      return;
    }

    const { response, data } = await updateAllMovie(movieId, {
      title: editingAllMovieTitle,
      genre: editingAllMovieGenre,
      description: editingAllMovieDescription,
      releaseYear: editingAllMovieReleaseYear,
    });

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage(data.message);
    resetAllMoviesEditState();
    await refreshLists();
  }

  // Switch tab
  function handleSwitchTab(tab) {
    setActiveTab(tab);
    resetWatchlistEditState();
    resetWatchedEditState();
    resetAllMoviesEditState();
    resetReviewState();
    setMessage('');

    if (tab === 'allMovies') {
      setCurrentPage(1);
    }
  }

  // Genre options for all movies tab
  const genreOptions = useMemo(() => {
    const options = [];

    allMovies.forEach((movie) => {
      if (movie.genre && !options.includes(movie.genre)) {
        options.push(movie.genre);
      }
    });

    return options;
  }, [allMovies]);

  // Filter, sort and paginate all movies
  const allMoviesView = useMemo(() => {
    let filteredMovies = [...allMovies];

    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      filteredMovies = filteredMovies.filter((movie) =>
        movie.title.toLowerCase().includes(keyword)
      );
    }

    if (selectedGenre) {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.genre === selectedGenre
      );
    }

    if (selectedDisplayedRating) {
      filteredMovies = filteredMovies.filter((movie) => {
        const averageNumber = Number(movie.averageRating);

        if (
          movie.averageRating === null ||
          movie.averageRating === undefined ||
          Number.isNaN(averageNumber)
        ) {
          return false;
        }

        return Math.round(averageNumber) === Number(selectedDisplayedRating);
      });
    }

    if (movieStatusFilter === 'notWatchedYet') {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.userStatus !== 'watched'
      );
    }

    if (movieStatusFilter === 'notInYourList') {
      filteredMovies = filteredMovies.filter(
        (movie) => movie.userStatus === 'notInList'
      );
    }

    if (sortOption === 'yearNewest') {
      filteredMovies.sort(
        (movieA, movieB) =>
          Number(movieB.releaseYear) - Number(movieA.releaseYear)
      );
    }

    if (sortOption === 'ratingHighest') {
      filteredMovies.sort((movieA, movieB) => {
        const ratingA =
          movieA.averageRating === null ? -1 : Number(movieA.averageRating);
        const ratingB =
          movieB.averageRating === null ? -1 : Number(movieB.averageRating);

        return ratingB - ratingA;
      });
    }

    const totalMovies = filteredMovies.length;
    const totalPages = Math.max(1, Math.ceil(totalMovies / moviesPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;

    return {
      totalMovies,
      totalPages,
      safeCurrentPage,
      startIndex,
      endIndex,
      paginatedMovies: filteredMovies.slice(startIndex, endIndex),
      visiblePageNumbers: getVisiblePageNumbers(totalPages, safeCurrentPage),
    };
  }, [
    allMovies,
    currentPage,
    movieStatusFilter,
    moviesPerPage,
    searchKeyword,
    selectedDisplayedRating,
    selectedGenre,
    sortOption,
  ]);

  return (
    <div className="watchlist-box">
      <div className="movie-tabs">
        <button
          type="button"
          className={activeTab === 'watchlist' ? 'movie-tab active-tab' : 'movie-tab'}
          onClick={() => handleSwitchTab('watchlist')}
        >
          Want to Watch
        </button>

        <button
          type="button"
          className={activeTab === 'watched' ? 'movie-tab active-tab' : 'movie-tab'}
          onClick={() => handleSwitchTab('watched')}
        >
          Watched
        </button>

        <button
          type="button"
          className={activeTab === 'allMovies' ? 'movie-tab active-tab' : 'movie-tab'}
          onClick={() => handleSwitchTab('allMovies')}
        >
          All Movies
        </button>
      </div>

      {activeTab === 'watchlist' && (
        <WatchlistTab
          title={title}
          onTitleChange={setTitle}
          onAddMovie={handleAddMovie}
          message={message}
          movies={watchlistMovies}
          editingMovieId={editingMovieId}
          rating={rating}
          hoverRating={hoverRating}
          review={review}
          onOpenWatchedForm={handleOpenWatchedForm}
          onRemoveMovie={handleRemoveMovie}
          onHoverRatingChange={setHoverRating}
          onRatingChange={setRating}
          onReviewChange={setReview}
          onMarkAsWatched={handleMarkAsWatched}
          onCancelWatchedForm={resetWatchlistEditState}
        />
      )}

      {activeTab === 'watched' && (
        <WatchedTab
          message={message}
          movies={watchedMovies}
          editingWatchedMovieId={editingWatchedMovieId}
          watchedRating={watchedRating}
          watchedHoverRating={watchedHoverRating}
          watchedReview={watchedReview}
          onOpenEditWatchedForm={handleOpenEditWatchedForm}
          onRemoveMovie={handleRemoveMovie}
          onWatchedHoverRatingChange={setWatchedHoverRating}
          onWatchedRatingChange={setWatchedRating}
          onWatchedReviewChange={setWatchedReview}
          onUpdateWatchedMovie={handleUpdateWatchedMovie}
          onCancelEditWatchedForm={resetWatchedEditState}
        />
      )}

      {activeTab === 'allMovies' && (
        <AllMoviesTab
          user={user}
          message={message}
          onOpenCreateMovie={onOpenCreateMovie}
          searchKeyword={searchKeyword}
          onSearchKeywordChange={(value) => {
            setSearchKeyword(value);
            setCurrentPage(1);
          }}
          selectedGenre={selectedGenre}
          genreOptions={genreOptions}
          onSelectedGenreChange={(value) => {
            setSelectedGenre(value);
            setCurrentPage(1);
          }}
          movieStatusFilter={movieStatusFilter}
          onMovieStatusFilterChange={(value) => {
            setMovieStatusFilter(value);
            setCurrentPage(1);
          }}
          selectedDisplayedRating={selectedDisplayedRating}
          onSelectedDisplayedRatingChange={(value) => {
            setSelectedDisplayedRating(value);
            setCurrentPage(1);
          }}
          sortOption={sortOption}
          onSortOptionChange={(value) => {
            setSortOption(value);
            setCurrentPage(1);
          }}
          moviesPerPage={moviesPerPage}
          onMoviesPerPageChange={(value) => {
            setMoviesPerPage(value);
            setCurrentPage(1);
          }}
          movies={allMoviesView.paginatedMovies}
          openReviewsMovieId={openReviewsMovieId}
          movieReviews={movieReviews}
          onAddMovieFromAllMovies={handleAddMovieFromAllMovies}
          onViewReviews={handleViewReviews}
          editingAllMovieId={editingAllMovieId}
          editingAllMovieTitle={editingAllMovieTitle}
          onEditingAllMovieTitleChange={setEditingAllMovieTitle}
          editingAllMovieGenre={editingAllMovieGenre}
          onEditingAllMovieGenreChange={setEditingAllMovieGenre}
          editingAllMovieDescription={editingAllMovieDescription}
          onEditingAllMovieDescriptionChange={setEditingAllMovieDescription}
          editingAllMovieReleaseYear={editingAllMovieReleaseYear}
          onEditingAllMovieReleaseYearChange={handleEditAllMovieReleaseYearChange}
          onOpenEditAllMovieForm={handleOpenEditAllMovieForm}
          onDeleteAllMovie={handleDeleteAllMovie}
          onUpdateAllMovie={handleUpdateAllMovie}
          onCancelEditAllMovieForm={resetAllMoviesEditState}
          totalMovies={allMoviesView.totalMovies}
          startIndex={allMoviesView.startIndex}
          endIndex={allMoviesView.endIndex}
          safeCurrentPage={allMoviesView.safeCurrentPage}
          totalPages={allMoviesView.totalPages}
          visiblePageNumbers={allMoviesView.visiblePageNumbers}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

WatchlistPage.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string,
  }).isRequired,
  onOpenCreateMovie: PropTypes.func.isRequired,
  initialTab: PropTypes.string,
};

export default WatchlistPage;