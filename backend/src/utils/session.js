const { randomBytes } = require('node:crypto');

// Create session token
function createSessionToken() {
  return randomBytes(32).toString('hex');
}

// Parse cookie header
function parseCookies(cookieHeader = '') {
  const cookies = {};
  const pairs = cookieHeader.split(';');

  pairs.forEach((pair) => {
    const parts = pair.trim().split('=');

    if (parts.length === 2) {
      cookies[parts[0]] = parts[1];
    }
  });

  return cookies;
}

// Read session token
function getSessionToken(req) {
  const cookies = parseCookies(req.headers.cookie || '');

  return cookies.sessionToken || '';
}

module.exports = {
  createSessionToken,
  getSessionToken,
};