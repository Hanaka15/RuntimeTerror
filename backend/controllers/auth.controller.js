const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Researcher, Token } = require("../models");

class AuthController {
  static async register(req, res) {
    const { username, password, email } = req.body;

    try {
      const existingResearcher = await Researcher.findOne({
        where: { email }
      });

      if (existingResearcher) {
        return res.status(400).json({ message: "Researcher already exists" });
      }

      // Hash password and create a new user
      const HashedPassword = await bcrypt.hash(password, 10);
      const newResearcher = await Researcher.create({
        username,
        password: HashedPassword,
        avatar: `https://api.dicebear.com/9.x/big-ears-neutral/svg?seed=${username}&scale=100`,
        email
      });

      res.status(201).json({
        message: "Researcher registered successfully",
        username: newResearcher.username,
        email: newResearcher.email
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await Researcher.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log(user.username)

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

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

      await Token.create({
        researcherId: user.id,
        token: refreshToken,
        expire: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
      });

      const userResponse = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        accessToken: accessToken
      }

      res.json({ ...userResponse }).status(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async getUser(req, res) {
    try {
      const id = req.user.id
      const user = await Researcher.findOne({ where: { id } });
      if (!user) {
        return res.status(401).json({ message: "user not found" });
      }

      console.log("GET /me " + user.username)

      const userResponse = {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      }

      res.json({ user: userResponse }).status(200);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error });
    }
  }

  static async logout(req, res) {
    const refreshToken = req.cookies.refreshToken;

    try {
      if (refreshToken) {
        await Token.destroy({
          where: { token: refreshToken },
        });
      }

      res.clearCookie("refreshToken");
      res.clearCookie("accessToken")
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
