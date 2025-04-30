require('dotenv').config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const cors = require("cors");

// Load custom configs
const connectDB = require("./config/db");
require("./config/passport"); // Passport config

const app = express();

// === Connect to DB ===
connectDB();

// === Middleware ===
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// === Session Configuration ===
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
}));

// === Passport ===
app.use(passport.initialize());
app.use(passport.session());

// === Routes ===
app.use("/auth", require("./routes/auth.routes"));
app.use("/studies", require("./routes/study.routes"));

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: "Something went wrong!" });
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

