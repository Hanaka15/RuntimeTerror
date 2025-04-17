const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware');

// Local
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthMiddleware.ensureAuth, AuthController.logout);
router.get('/me', AuthMiddleware.ensureAuth, AuthController.getUser);

// Google
router.get('/google', AuthController.googleAuth);
router.get('/google/callback', AuthController.googleCallback);

// Failed
router.get('/login-failed', AuthController.loginFailed);

module.exports = router;
