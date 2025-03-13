const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/AuthController");
const rateLimiter = require("../utils/rateLimiter");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", rateLimiter, passport.authenticate("local"), AuthController.login);
router.post("/logout", AuthController.logout);

module.exports = router;
