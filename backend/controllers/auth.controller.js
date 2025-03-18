const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
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

      // Create JWT tokens
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });

      // Store refresh token in the database
      await RefreshToken.create({ token: refreshToken, userId: user.id });

      // Set refresh token in cookies
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      res.json({ message: "Logged in successfully", accessToken });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await RefreshToken.findOneAndDelete({ token: refreshToken });
    }

    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "secret", async (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret", { expiresIn: "15m" });
      res.json({ accessToken });
    });
  }
}

module.exports = AuthController;
