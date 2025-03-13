const session = require("express-session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis");
require("dotenv").config();

const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().catch(console.error);

module.exports = session({
  store: new RedisStore({ client: redisClient, disableTouch: true }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
});
