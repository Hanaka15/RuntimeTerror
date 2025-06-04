require('dotenv').config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const connectDB = require("./config/db");
require("./config/passport");

const app = express();

// Trust proxy for deployment behind nginx
app.set('trust proxy', 1);


app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use(cors({
  origin: [
    process.env.CLIENT_URL, 
    "http://localhost:8182",
    "http://localhost:5173", // Add Vite dev server
    "https://group2.sustainability.it.ntnu.no"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));


app.use(session({
  name: 'sessionId',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60 * 24 * 7, // 7 days
  }),
  cookie: {
    httpOnly: true,
    secure: false, // Force false for now since we're behind nginx proxy
    sameSite: "lax", // Change from "none" to "lax" for better compatibility
    maxAge: 1000 * 60 * 60 * 24 * 7,
    // Remove domain setting that was causing issues
  }
}));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// === Passport ===
app.use(passport.initialize());
app.use(passport.session());

// === Routes ===
app.use("/auth", require("./routes/auth.routes"));
app.use("/studies", require("./routes/study.routes"));
app.use("/sessions", require("./routes/participant.routes"));

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Something went wrong!" , error: err.message});
});

connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;