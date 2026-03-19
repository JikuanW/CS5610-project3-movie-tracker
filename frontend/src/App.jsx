import { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import UserPanel from './components/UserPanel';
import CreateMoviePage from './components/CreateMoviePage';
import './App.css';

// Root app component
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('watchlist');
  const [pendingTitle, setPendingTitle] = useState('');
  const [returnTab, setReturnTab] = useState('watchlist');
  const [autoAddToWatchlistAfterCreate, setAutoAddToWatchlistAfterCreate] =
    useState(false);

  // Check login status on page load
  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then(async (response) => {
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          setUser(null);
          setLoading(false);
          return;
        }

        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Logout
  async function handleLogout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    setUser(null);
    setPage('watchlist');
    setPendingTitle('');
    setReturnTab('watchlist');
    setAutoAddToWatchlistAfterCreate(false);
  }

  // Open create movie page
  function handleOpenCreateMovie(title, nextTab, autoAddToWatchlist) {
    setPendingTitle(title || '');
    setReturnTab(nextTab || 'watchlist');
    setAutoAddToWatchlistAfterCreate(Boolean(autoAddToWatchlist));
    setPage('createMovie');
  }

  // Go back to movie list page
  function handleBackToWatchlist() {
    setPage('watchlist');
    setPendingTitle('');
  }

  // Go back after create movie success
  function handleCreateMovieSuccess() {
    setPage('watchlist');
    setPendingTitle('');
  }

  if (loading) {
    return (
      <div className="app-page">
        <div className="app-shell">
          <p className="loading-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="app-shell">
        <div className="app-header">
          <h1>Movie Tracker</h1>
          <p className="app-subtitle">Manage your personal movie watchlist.</p>
        </div>

        {!user ? (
          <AuthForm onLogin={setUser} />
        ) : page === 'createMovie' ? (
          <CreateMoviePage
            title={pendingTitle}
            autoAddToWatchlist={autoAddToWatchlistAfterCreate}
            onBack={handleBackToWatchlist}
            onSuccess={handleCreateMovieSuccess}
          />
        ) : (
          <UserPanel
            user={user}
            onLogout={handleLogout}
            onOpenCreateMovie={handleOpenCreateMovie}
            initialTab={returnTab}
          />
        )}
      </div>
    </div>
  );
}

export default App;
