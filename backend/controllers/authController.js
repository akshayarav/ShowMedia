const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

// Generate JWT token function (reusable)
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { email, username, password, first, last } = req.body;

    // Check if email is already registered
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(409).json({ error: "Email already has an account" });
    }

    // Check if username is already taken
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(409).json({ error: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({
      email,
      username,
      passwordHash: hashedPassword,
      first,
      last,
    });

    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = generateToken(savedUser);

    res.status(201).json({
      token,
      userId: savedUser._id,
      username: savedUser.username
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login an existing user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    // Check if user has a password (Google users might not)
    if (!user.passwordHash) {
      return res.status(401).json({ 
        error: "This account uses Google Sign-In. Please sign in with Google."
      });
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = generateToken(user);

    res.status(200).json({
      token,
      userId: user._id,
      username: user.username,
      message: "Login successful!",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "An error occurred during the login process." });
  }
};

// Handle Google authentication callback
const handleGoogleCallback = (req, res) => {
  try {
    // The user is already authenticated by Passport at this point
    const user = req.user;
    
    // Generate a JWT token
    const token = generateToken(user);
    
    // Redirect to frontend with token and user info
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(
      `${clientUrl}/auth-callback?token=${token}&userId=${user._id}&username=${user.username}`
    );
  } catch (error) {
    console.error("Google auth callback error:", error);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    res.redirect(`${clientUrl}/login?error=auth`);
  }
};

module.exports = { 
  registerUser, 
  loginUser, 
  handleGoogleCallback,
  generateToken
};