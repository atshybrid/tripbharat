const AppError = require('../utils/appError');

// Check if user is admin
exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }

  next();
};

// Check if user is admin or accessing their own resource
exports.isAdminOrOwner = (resourceUserId) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Allow if admin
    if (req.user.role === 'admin') {
      return next();
    }

    // Allow if user is accessing their own resource
    const userId = req.user._id.toString();
    const ownerIdParam = req.params[resourceUserId];
    const ownerIdBody = req.body[resourceUserId];
    
    if (userId === ownerIdParam || userId === ownerIdBody || userId === resourceUserId) {
      return next();
    }

    return next(new AppError('Access denied. You can only access your own resources.', 403));
  };
};
