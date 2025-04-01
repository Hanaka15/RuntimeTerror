const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

// Register route
router.post("/register", AuthController.register);

// Login route
router.post("/login", AuthController.login);

// Logout route
router.post("/logout", AuthController.logout);

// Refresh token
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;
