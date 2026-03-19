import { useState } from 'react';
import PropTypes from 'prop-types';
import './AuthForm.css';

// Register and login form component
function AuthForm({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Submit form
  async function handleSubmit(event) {
    event.preventDefault();

    const url = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    const body = { username, password };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    if (mode === 'register') {
      setMessage('Register successful. Please login.');
      setMode('login');
      setPassword('');
      return;
    }

    setMessage('');
    setPassword('');
    onLogin(data.user);
  }

  // Switch mode
  function handleSwitch() {
    setMode(mode === 'login' ? 'register' : 'login');
    setMessage('');
  }

  return (
    <div className="auth-form-box">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>

      {message && <p className="auth-message">{message}</p>}

      <button type="button" className="switch-button" onClick={handleSwitch}>
        {mode === 'login' ? 'Go to Register' : 'Go to Login'}
      </button>
    </div>
  );
}

AuthForm.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default AuthForm;
