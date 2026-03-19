import PropTypes from 'prop-types';
import WatchlistPage from './WatchlistPage';
import './UserPanel.css';

// User panel component
function UserPanel({ user, onLogout, onOpenCreateMovie, initialTab }) {
  return (
    <div className="user-panel">
      <div className="user-panel-top">
        <div className="user-panel-text">
          <h2>Welcome, {user.username}</h2>
        </div>

        <button type="button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <WatchlistPage
        user={user}
        onOpenCreateMovie={onOpenCreateMovie}
        initialTab={initialTab}
      />
    </div>
  );
}

UserPanel.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    role: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
  onOpenCreateMovie: PropTypes.func.isRequired,
  initialTab: PropTypes.string,
};

export default UserPanel;
