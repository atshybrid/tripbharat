const { User, Referral } = require('../models');
const AppError = require('../utils/appError');
const { sendWelcomeEmail } = require('../utils/emailService');
const { uploadImage } = require('../utils/imageUpload');
const logger = require('../utils/logger');
const { OAuth2Client } = require('google-auth-library');

// Accept both Web and Android client IDs
const GOOGLE_CLIENT_IDS = (process.env.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '')
  .split(',')
  .map(id => id.trim())
  .filter(Boolean);

const googleClient = new OAuth2Client();

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, referralCode } = req.body;

    // Check if user already exists (compatible with both MongoDB and PostgreSQL)
    const dbType = process.env.DB_TYPE || 'mongodb';
    const existingUser = dbType === 'postgresql' 
      ? await User.findOne({ where: { email } })
      : await User.findOne({ email });
      
    if (existingUser) {
      return next(new AppError('Email already registered', 400));
    }

    // Create user object
    const userData = {
      name,
      email,
      password,
      phone
    };

    // Handle referral code if provided
    if (referralCode) {
      const referrer = dbType === 'postgresql'
        ? await User.findOne({ where: { referralCode: referralCode.toUpperCase() } })
        : await User.findOne({ referralCode: referralCode.toUpperCase() });
      
      if (!referrer) {
        return next(new AppError('Invalid referral code', 400));
      }

      if (referrer.email === email) {
        return next(new AppError('You cannot use your own referral code', 400));
      }

      userData.referredBy = referrer._id;
    }

    // Create user
    const user = await User.create(userData);

    // Create referral record if user was referred
    if (userData.referredBy) {
      await Referral.create({
        referrerId: userData.referredBy,
        referredUserId: user._id,
        referralCode: referralCode.toUpperCase(),
        status: 'pending'
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    // Send welcome email (async, don't wait)
    sendWelcomeEmail(user).catch(err => 
      logger.error(`Welcome email failed: ${err.message}`)
    );

    // Return response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          referralCode: user.referralCode,
          wallet: user.wallet,
          isVerified: user.isVerified,
          createdAt: user.createdAt
        },
        token,
        expiresIn: process.env.JWT_EXPIRE || '24h'
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password field (compatible with both MongoDB and PostgreSQL)
    const dbType = process.env.DB_TYPE || 'mongodb';
    let user;
    
    if (dbType === 'postgresql') {
      // Sequelize: use where option and attributes to include password
      user = await User.findOne({
        where: { email },
        attributes: { include: ['password'] }
      });
    } else {
      // Mongoose: use select to include password
      user = await User.findOne({ email }).select('+password');
    }

    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Check if account is locked (method name differs between models)
    const isLocked = user.isAccountLocked ? user.isAccountLocked() : user.isLocked();
    if (isLocked) {
      return next(new AppError('Account is temporarily locked due to multiple failed login attempts. Please try again later.', 423));
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts (method name differs between MongoDB and PostgreSQL models)
      if (user.incrementLoginAttempts) {
        await user.incrementLoginAttempts();
      } else if (user.incLoginAttempts) {
        await user.incLoginAttempts();
      }
      return next(new AppError('Invalid email or password', 401));
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0 || user.lockUntil) {
      await user.resetLoginAttempts();
    }

    // Generate token
    const token = user.generateAuthToken();

    // Remove password from response
    user.password = undefined;

    // Return response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          referralCode: user.referralCode,
          wallet: user.wallet,
          isVerified: user.isVerified,
          profileImage: user.profileImage
        },
        token,
        expiresIn: process.env.JWT_EXPIRE || '24h'
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    
    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    // Handle profile image upload if file is provided
    if (req.file) {
      const imageUrl = await uploadImage(req.file.buffer, 'sktours/profiles');
      updates.profileImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError('No user found with this email', 404));
    }

    // Generate reset token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const { sendPasswordResetEmail } = require('../utils/emailService');
    await sendPasswordResetEmail(user, resetToken);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Hash token
    const crypto = require('crypto');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('Invalid or expired reset token', 400));
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Login / Register with Google OAuth
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return next(new AppError('Google ID token is required', 400));
    }

    if (GOOGLE_CLIENT_IDS.length === 0) {
      return next(new AppError('Google OAuth is not configured on this server', 503));
    }

    // Verify the Google ID token against all configured client IDs
    let payload;
    let lastError;
    for (const clientId of GOOGLE_CLIENT_IDS) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: clientId
        });
        payload = ticket.getPayload();
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!payload) {
      logger.warn(`Google token verification failed: ${lastError?.message}`);
      return next(new AppError('Invalid Google token', 401));
    }

    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return next(new AppError('Google account email is not verified', 400));
    }

    const dbType = process.env.DB_TYPE || 'mongodb';

    // Find by googleId first, then by email
    let user = dbType === 'postgresql'
      ? await User.findOne({ where: { googleId } })
      : await User.findOne({ googleId });

    if (!user) {
      // Try to find by email (link existing account)
      user = dbType === 'postgresql'
        ? await User.findOne({ where: { email } })
        : await User.findOne({ email });

      if (user) {
        // Link Google to existing account
        if (dbType === 'postgresql') {
          await user.update({ googleId, authProvider: 'google', profileImage: user.profileImage || picture });
        } else {
          user.googleId = googleId;
          user.authProvider = 'google';
          if (!user.profileImage) user.profileImage = picture;
          await user.save();
        }
      } else {
        // Create new user via Google
        const userData = {
          name,
          email,
          googleId,
          authProvider: 'google',
          profileImage: picture,
          isEmailVerified: true
        };

        if (dbType === 'postgresql') {
          user = await User.create(userData);
        } else {
          user = await User.create(userData);
        }

        // Send welcome email (async)
        sendWelcomeEmail(user).catch(err =>
          logger.error(`Welcome email failed: ${err.message}`)
        );
      }
    }

    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 403));
    }

    // Update last login
    if (dbType === 'postgresql') {
      await user.update({ lastLogin: new Date() });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = user.generateAuthToken();

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: {
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
          walletBalance: user.walletBalance,
          referralCode: user.referralCode,
          authProvider: user.authProvider
        }
      }
    });

  } catch (error) {
    logger.error(`Google login error: ${error.message}`);
    next(error);
  }
};
