const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const Validator = require("../middleware/validation.middleware")

router.post("/register", Validator.validateRegister(), AuthController.register);
router.post("/login",  Validator.validateLogin(), AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh-token", AuthController.refreshToken);

module.exports = router;