const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

// Register route
router.post(
    "/register",
    body("username")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long")
        .escape(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    // After validation, proceed to controller
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await AuthController.register(req, res);
    }
);

// Login route
router.post(
    "/login",
    body("username").trim().escape(),
    body("password").exists().withMessage("Password is required"),

    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        await AuthController.login(req, res);
    }
);

// Logout route
router.post("/logout", async (req, res) => {
    await AuthController.logout(req, res);
});

// Refresh token
router.post("/refresh-token", async (req, res) => {
    await AuthController.refreshToken(req, res);
});

module.exports = router;
