import { useState } from 'react';
import PropTypes from 'prop-types';
import { MOVIE_GENRES } from '../constants/movieGenres';
import './CreateMoviePage.css';

// Create movie page component
function CreateMoviePage({ title, autoAddToWatchlist, onBack, onSuccess }) {
  const [movieTitle, setMovieTitle] = useState(title || '');
  const [genre, setGenre] = useState('Action');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [message, setMessage] = useState('');

  // Keep only 4-digit year input
  function handleReleaseYearChange(event) {
    const value = event.target.value.replace(/\D/g, '').slice(0, 4);
    setReleaseYear(value);
  }

  // Submit create movie form
  async function handleSubmit(event) {
    event.preventDefault();

    if (!/^\d{4}$/.test(releaseYear)) {
      setMessage('Release year must be exactly 4 digits');
      return;
    }

    const response = await fetch('/api/watchlist/create-movie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        title: movieTitle,
        genre,
        description,
        releaseYear,
        autoAddToWatchlist,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage('');
    onSuccess();
  }

  return (
    <div className="watchlist-box">
      <h3>Create New Movie</h3>

      <form onSubmit={handleSubmit}>
        <div className="watchlist-row">
          <label htmlFor="title">Movie Title</label>
          <input
            id="title"
            type="text"
            value={movieTitle}
            onChange={(event) => setMovieTitle(event.target.value)}
          />
        </div>

        <div className="watchlist-row">
          <label htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          >
            {MOVIE_GENRES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="watchlist-row">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="watchlist-row">
          <label htmlFor="releaseYear">Release Year</label>
          <input
            id="releaseYear"
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={releaseYear}
            onChange={handleReleaseYearChange}
          />
        </div>

        {message && <p className="watchlist-message">{message}</p>}

        <div className="create-movie-actions">
          <button type="submit">Create Movie</button>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

CreateMoviePage.propTypes = {
  title: PropTypes.string,
  autoAddToWatchlist: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default CreateMoviePage;
