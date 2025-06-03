const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Researcher = require("../models/researcher.model");
const bcrypt = require("bcryptjs");

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let researcher = await Researcher.findOne({ googleId: profile.id });
    if (!researcher) {
      researcher = new Researcher({
        googleId: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos?.[0]?.value || null
      });
      await researcher.save();
    }
    return done(null, researcher);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new LocalStrategy({
  usernameField: "email"
}, async (email, password, done) => {
  try {
    const researcher = await Researcher.findOne({ email });
    if (!researcher || !(await bcrypt.compare(password, researcher.password))) {
      return done(null, false, { message: "Invalid email or password" });
    }
    return done(null, researcher);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((researcher, done) => {
  done(null, researcher.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const researcher = await Researcher.findById(id).select("-password");
    done(null, researcher);
  } catch (err) {
    done(err);
  }
});
