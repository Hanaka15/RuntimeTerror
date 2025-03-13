const User = require("../models/User");
const jwt = require("jsonwebtoken");

class AuthController {
  static async register(req, res) {
    try {
      const { username, password } = req.body;
      if (await User.findOne({ username })) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new User({ username, password });
      await newUser.save();
      res.status(201).json({ message: "User registered" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }

  static login(req, res) {
    if (req.body.rememberMe) {
      const refreshToken = jwt.sign(
        { id: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }
    res.json({ message: "Logged in", user: req.user });
  }

  static logout(req, res) {
    req.logout(() => {
      res.clearCookie("connect.sid");
      res.clearCookie("refreshToken");
      res.json({ message: "Logged out" });
    });
  }
}

module.exports = AuthController;
