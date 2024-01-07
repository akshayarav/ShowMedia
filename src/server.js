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

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  show: {
    type: Number,
    ref: 'Show'
  },
  rating: Number,
});

const Rating = mongoose.model('Rating', ratingSchema);

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  passwordHash: String,
  first: String,
  last: String,
  profilePicture: {
    type: String,
    default: '/default_profile.jpg'
  },
  bio: {
    type: String,
    default: ''
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
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

    const username = await User.findOne({ username: req.body.username });
    if (username) {
      return res.status(409).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = new User({
      email: req.body.email,
      username: req.body.username,
      passwordHash: hashedPassword,
      first: req.body.first,
      last: req.body.last
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
      token: token,
      userId: savedUser._id,
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
          username: user.username,
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User or show not found' });
    }

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

app.get('/api/ratings/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      console.log('No userId provided');
      return res.status(400).send('No userId provided');
    }

    const ratings = await Rating.find({ user: userId });

    res.send(ratings);
  } catch (error) {
    console.error('Error occurred in /api/ratings/:userId:', error); // Log the error details
    res.status(500).send('Internal Server Error');
  }
});

app.get('/verify', async (req, res) => {
  const { token } = req.query;
  // Find the user with this token and set their account to verified
});

app.get('/api/user/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { passwordHash, ...userData } = user.toObject();
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/api/search/users', async (req, res) => {
  try {
    const searchQuery = req.query.q || '';
    const regex = new RegExp(searchQuery, 'i');
    const users = await User.find({ username: { $regex: regex } }).select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post('/edit/:username', async (req, res) => {
  const { username } = req.params;
  const { bio } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ username }, { bio }, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/follow/:username', async (req, res) => {
  const { username } = req.params;
  const { userId } = req.body;

  try {
    const userToFollow = await User.findOne({ username });
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).send('User not found');
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).send('You are already following this user');
    }

    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    const updatedUser = await User.findById(userId).populate('following');
    res.status(200).json(updatedUser);

  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/following/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'following',
      });
    res.status(200).json(user.following);
  } catch (error) {
    console.error('Error getting following list:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/unfollow/:username', async (req, res) => {
  const { username } = req.params;
  const { userId } = req.body;

  try {
    const userToUnfollow = await User.findOne({ username });
    const currentUser = await User.findById(userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).send('User not found');
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).send('You are not following this user');
    }

    currentUser.following.pull(userToUnfollow._id);
    await currentUser.save();

    userToUnfollow.followers.pull(currentUser._id);
    await userToUnfollow.save();

    const updatedUser = await User.findById(userId).populate('following');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/followers/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId)
      .populate({
        path: 'followers',
      });
    res.status(200).json(user.followers);
  } catch (error) {
    console.error('Error getting followers list:', error);
    res.status(500).send('Internal Server Error');
  }
});




