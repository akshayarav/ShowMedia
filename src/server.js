require('dotenv').config();
console.log(process.env.MONGODB_URI);

const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(cors());
app.use(express.json());

console.log("CORS CONNECT")
console.log(process.env.ALLOWED_ORIGIN)

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

const showSchema = new mongoose.Schema({
  title: String,
  description: String
});

const Show = mongoose.model('Show', showSchema);

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  show: {
    type: Number,
    ref: 'Show'
  },
  rating: Number
});

const Rating = mongoose.model('Rating', ratingSchema);

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  passwordHash: String,
});

const User = mongoose.model('User', userSchema);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/register', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).json({ error: "Email already has an account" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      passwordHash: hashedPassword
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      token: token, // Generate and send a token
      userId: savedUser._id
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).send(error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const validPassword = await bcrypt.compare(req.body.password, user.passwordHash);
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      if (validPassword) {
        res.status(200).json({
          token: token,
          userId: user._id,
          message: "Login successful!"
        });
      } else {
        res.status(400).json({ error: "Invalid password" });
      }
    } else {
      res.status(401).json({ error: "User does not exist" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: "An error occurred during the login process." });
  }
});

app.post('/rate', async (req, res) => {
  try {
    const { userId, showId, rating } = req.body;
    // const user = await User.findById(userId);

    // if (!user) {
    //   return res.status(404).json({ message: 'User or show not found' });
    // }

    const newRating = new Rating({
      user: userId,
      show: showId,
      rating: rating
    });

    const savedRating = await newRating.save();
    res.status(200).json({ message: 'Rating added successfully' });
  } catch (error) {
    console.log(req.body)
    console.error(error);
    res.status(500).json({ message: 'Error adding rating' });
  }
});