const express = require("express");
const passport = require("passport");
const AuthController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", passport.authenticate("local", { session: false }), AuthController.login);
router.post("/refresh", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

module.exports = router;
