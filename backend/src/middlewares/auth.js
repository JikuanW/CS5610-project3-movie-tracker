// Require user login
function requireLogin(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({
      message: 'Not logged in',
    });
  }

  req.currentUser = req.user;

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

export { requireLogin, requireAdmin };