const { getCurrentUser } = require('../utils/currentUser');

// Require user login
async function requireLogin(req, res, next) {
  const user = await getCurrentUser(req);

  if (!user) {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }

  req.currentUser = user;

  return next();
}

// Require admin role
function requireAdmin(req, res, next) {
  if (!req.currentUser || req.currentUser.role !== 'admin') {
    return res.status(403).json({
      message: 'Admin access required',
    });
  }

  return next();
}

module.exports = {
  requireLogin,
  requireAdmin,
};