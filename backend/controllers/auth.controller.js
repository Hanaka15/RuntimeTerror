const passport = require('passport');
const Researcher = require('../models/researcher.model');
const bcrypt = require('bcryptjs');

class AuthController {
  /**
   * @route POST /auth/register
   */
  static async register(req, res) {
    const { username, email, password } = req.body;

    try {
      // Check if researcher already exists
      const existingResearcher = await Researcher.findOne({ email });
      if (existingResearcher) {
        return res.status(400).json({ error: "Email is already taken. Please use a different email." });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new researcher
      const newResearcher = new Researcher({
        username,
        email,
        password: hashedPassword,
      });

      await newResearcher.save();

      return res.status(200).json({
        message: "Registration successful! You can now log in.",
        researcher: {
          id: newResearcher._id,
          username: newResearcher.username,
          email: newResearcher.email,
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ error: "An error occurred during registration. Please try again later." });
    }
  }

  /**
   * @route POST /auth/login
   * Uses Passport Local Strategy
   */
  static login(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info.message || 'Login failed' });

      req.logIn(user, (err) => {
        if (err) return next(err);
        const { id, username, email } = user;
        return res.status(200).json({ message: "Login successful", researcher: { id, username, email } });
      });
    })(req, res, next);
  }

  /**
   * @route POST /auth/logout
   */
  static logout(req, res, next) {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ message: 'Logged out successfully' });
    });
  }

  /**
   * @route GET /auth/google
   */
  static googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

  /**
   * @route GET /auth/google/callback
   */
  static googleCallback(req, res, next) {
    passport.authenticate('google', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect('/auth/login-failed');

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect('/user/me');
      });
    })(req, res, next);
  }

  /**
   * @route GET /auth/login-failed
   */
  static loginFailed(req, res) {
    res.status(401).json({ error: 'Login failed' });
  }

  /**
   * @route GET /user/me
   */
  static async getUser(req, res) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

      const researcher = await Researcher.findById(req.user.id).select('-password');
      if (!researcher) return res.status(404).json({ error: 'User not found' });

      res.json({ researcher }).status(200);
    } catch (err) {
      console.error("Fetch logged-in user error:", err);
      res.status(500).json({ error: 'Failed to retrieve user information' });
    }
  }
}

module.exports = AuthController;