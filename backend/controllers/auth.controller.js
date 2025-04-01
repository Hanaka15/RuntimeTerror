const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models/user.model");
const { Token } = require("../models/tokens.model");

class AuthController {
  static async register(req, res) {
    const { username, password } = req.body;

    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        username: username.trim(),
        password: hashedPassword,
      });

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async login(req, res) {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ where: { username } });
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

      // Save the refresh token in the database
      await Token.create({
        userId: user.id,
        token: refreshToken,
        expire: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // Expire in 30 days
      });

      res.json({ message: "Logged in", accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;

    try {
      if (refreshToken) {
        // Delete the refresh token from the database
        await Token.destroy({
          where: { token: refreshToken },
        });
      }

      res.clearCookie("refreshToken");
      res.json({ message: "Logged out" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const tokenRecord = await Token.findOne({
        where: { token: refreshToken },
      });

      if (!tokenRecord) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }
}

module.exports = AuthController;
