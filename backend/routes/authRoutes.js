const express = require('express');
const passport = require('passport');
const { registerUser, loginUser, handleGoogleCallback } = require('../controllers/authController');

const router = express.Router();

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Google authentication routes
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'  // Always show account selection
  })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  handleGoogleCallback
);

module.exports = router;