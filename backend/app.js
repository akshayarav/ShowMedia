// app.js
require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require("path");
const session = require('express-session');
const passport = require('./config/passport');

// Import routes
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const seasonRatingRoutes = require('./routes/seasonRatingRoutes');
const authRoutes = require('./routes/authRoutes');

// Initialize app
const app = express();

// Configure middleware
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "src")));

// Configure CORS
const isTesting = process.env.IS_TESTING === "true";
if (isTesting) {
  app.use(cors());
  console.log("CORS enabled for all origins (testing mode)");
} else {
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN,
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  console.log(`CORS restricted to: ${process.env.ALLOWED_ORIGIN}`);
}

// Configure session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Configure routes with consistent prefixes
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/seasonRatings', seasonRatingRoutes);

// Export the configured app
module.exports = app;