const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const Token = require("../models/tokens.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

class AuthController {
  static async register(req, res) {
    const { username, password } = req.body;

    try {
      // Check if user already exists
      if (await User.findOne({ username })) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username: username.trim(), password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT tokens
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "30d" }
      );

      // Set refresh token in cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 10, // 15 min
      });

      const newToken = new Token({
        userId: user.id,
        token: refreshToken,
        expire: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      });

      await newToken.save();

      res.json({ message: "Logged in", accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await Token.findOneAndDelete({ token: refreshToken });
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken && !await Token.findOne({ token: refreshToken }) ) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Invalid refresh token" });

      const accessToken = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    });
  }
}

module.exports = AuthController;
