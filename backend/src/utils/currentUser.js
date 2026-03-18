const { getDb } = require('../db/mongo');
const { getSessionToken } = require('./session');

// Get current logged in user
async function getCurrentUser(req) {
  const sessionToken = getSessionToken(req);

  if (!sessionToken) {
    return null;
  }

  const db = getDb();
  const sessions = db.collection('sessions');
  const users = db.collection('users');

  const session = await sessions.findOne({ token: sessionToken });

  if (!session) {
    return null;
  }

  const user = await users.findOne({ _id: session.userId });

  if (!user) {
    return null;
  }

  return user;
}

module.exports = {
  getCurrentUser,
};