require('dotenv').config();
console.log(process.env.MONGODB_URI);

const cors = require('cors');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const saltRounds = 10;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'src')));

console.log("CORS CONNECT")
console.log(process.env.ALLOWED_ORIGIN)

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

/*
=====================================================================================================================================================================

DATABASES

=====================================================================================================================================================================
*/

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

//Database for users
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
  }],
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

//Database for comments under activities
const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comment: String,
  timestamp: { type: Date, default: Date.now },
  profilePicture: String,
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Comment = mongoose.model('Comment', commentSchema);

//Database for a user's ratings that appear on their profile
const seasonRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  show: Number,
  season: Number,
  rating: Number,
  comment: String,
  status: String,
  episodes: String,
  hours: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const SeasonRating = mongoose.model('SeasonRating', seasonRatingSchema);

//Database for activites
const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: String,
  showId: Number,
  showName: String,
  showImage: String,
  seasonNumber: Number,
  rating: Number,
  status: String,
  episodes: String,
  comment: String,
  review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  timestamp: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Activity = mongoose.model('Activity', activitySchema);

//Database for official show reviews
const reviewSchema = new mongoose.Schema({
  showId: Number,
  score: Number,
  text: String,
  profileImg: String,
  username: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reviewSchema.virtual('votes').get(function () {
  return this.upvotes.length - this.downvotes.length;
});

const Review = mongoose.model('Review', reviewSchema);

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const Message = mongoose.model('Message', messageSchema);

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  updatedAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model('Conversation', conversationSchema);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



/*
=====================================================================================================================================================================

ENDPOINTS

=====================================================================================================================================================================
*/

//GET the stats of a user with username {username}
app.get('/api/user/stats/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch all season ratings for this user
    const seasonRatings = await SeasonRating.find({ user: user._id });

    // Calculate the total number of shows, episodes seen, and average rating
    const totalShows = seasonRatings.length;
    const totalEpisodes = seasonRatings.reduce((sum, rating) => {
      const episodesWatched = rating?.episodes.match(/\d+/);
      return sum + (episodesWatched ? parseInt(episodesWatched[0], 10) : 0);
    }, 0);
    const totalHours = seasonRatings.reduce((sum, rating) => sum + (rating.hours || 0), 0); // Sum the hours
    const averageRating = seasonRatings.reduce((sum, rating) => sum + rating.rating, 0) / totalShows;
    
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Filter activities by the current year and group by month
    const monthlyActivity = await Activity.aggregate([
      { $match: { user: user._id, timestamp: { $gte: new Date(`${currentYear}-01-01`), $lt: new Date(`${currentYear + 1}-01-01`) } } },
      { $group: { _id: { month: { $month: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } } // Sort by month
    ]);
    // Format the data for easier consumption (e.g., array of counts indexed by month)
    let monthlyCounts = Array(12).fill(0); // Initialize an array for 12 months
    monthlyActivity.forEach(activity => {
      const monthIndex = activity._id.month - 1; // Month index (0-11)
      monthlyCounts[monthIndex] = activity.count;
    });

    // Return the stats including monthly activity counts
    res.json({
      username: username,
      totalShows: totalShows,
      totalEpisodes: totalEpisodes,
      totalHours: totalHours.toFixed(2),
      averageRating: isNaN(averageRating) ? 0 : averageRating.toFixed(2),
      monthlyActivity: monthlyCounts
    });
    
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// GET endpoint to fetch a conversation between two users
app.get('/api/conversations/find', async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;

    // Find a conversation that includes both userId1 and userId2
    const conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    }).exec();

    if (!conversation) {
      return res.status(404).send('Conversation not found');
    }

    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// GET endpoint to fetch conversations for a user
app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch conversations where the user is a participant
    const conversations = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 }) // Sort by updatedAt in descending order
      .populate('participants', 'username') // Optionally populate participant details
      .exec();

    res.json(conversations);
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

// POST endpoint to create a new conversation
app.post('/api/conversations/create', async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;

    // Check if users exist in the database
    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);
    if (!user1 || !user2) {
      return res.status(404).send('One or both users not found');
    }

    // Check if a conversation between these users already exists
    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] }
    });

    if (conversation) {
      // Conversation already exists, return it
      return res.json(conversation);
    } else {
      // Create a new conversation
      conversation = new Conversation({
        participants: [userId1, userId2],
        messages: [] // Starting with an empty message array
      });

      // Save the conversation to the database
      await conversation.save();

      res.status(201).json(conversation);
    }
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});

// GET endpoint to fetch a message by its ID
app.get('/api/messages/:messageId', async (req, res) => {
  try {
    const messageId = req.params.messageId;

    // Find the message by ID
    const message = await Message.findById(messageId).exec();

    if (!message) {
      return res.status(404).send('Message not found');
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).send('Server error: ' + error.message);
  }
});

// POST endpoint for sending a message
app.post('/api/messages/send', async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    // Basic validation
    if (!sender || !receiver || !message) {
      return res.status(400).send('Missing required fields');
    }

    // Create a new message
    const newMessage = new Message({
      sender,
      receiver,
      message
    });

    // Save the message to the database
    await newMessage.save();

    // Find the conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] }
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = new Conversation({
        participants: [sender, receiver],
        messages: []
      });
    }

    // Add the new message to the conversation
    conversation.messages.push(newMessage._id);

    // Update the conversation in the database
    await conversation.save();

    res.status(201).send('Message sent successfully');
  } catch (error) {
    res.status(500).send('Server error: ' + error.message);
  }
});


//Add a new review
app.post('/api/reviews', (req, res) => {
  const { showId, username } = req.body; // Assuming you're passing the user's ID in the request body

  // First, check if the user has already reviewed this show
  Review.findOne({ showId, username })
    .then(existingReview => {
      if (existingReview) {
        // User has already reviewed this show
        return res.status(400).json({ message: "You have already reviewed this show." });
      } else {
        // No existing review, create a new one
        const newReview = new Review({
          showId: req.body.showId,
          userId: req.body.userId, // Save the user's ID with the review
          score: req.body.score,
          text: req.body.text,
          profileImg: req.body.profileImg,
          username: req.body.username,
          upvotes: [], // Initialize as an empty array
          downvotes: [] // Initialize as an empty array
        });

        console.log(newReview)

        newReview.save()
          .then(review => res.status(201).json(review))
          .catch(err => res.status(500).json({ error: err.message }));
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});


//Delete a review with id {reviewId} by user with username {username}
app.delete('/api/reviews/:reviewId', (req, res) => {
  const reviewId = req.params.reviewId;
  const username = req.query.username;

  // Find the review by ID
  Review.findById(reviewId)
    .then(review => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if the review was written by the user making the request
      if (review.username !== username) {
        // If usernames do not match
        return res.status(403).json({ message: 'Unauthorized to delete this review' });
      }

      // Delete the review
      Review.findByIdAndDelete(reviewId)
        .then(() => res.status(200).json({ message: 'Review deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

//Get all the reviews for show with id {showId}
app.get('/api/reviews/:showId', (req, res) => {
  Review.find({ showId: req.params.showId })
    .then(reviews => res.json(reviews))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint to upvote a review
app.post('/api/reviews/:reviewId/upvote', (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.body.userId; // The ID of the user who is upvoting
  console.log("USERID" + userId)

  Review.findById(reviewId)
    .then(review => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }


      // Add userId to upvotes if not already there, and remove from downvotes if present
      const alreadyUpvoted = review.upvotes.includes(userId);
      const alreadyDownvoted = review.downvotes.includes(userId);
      if (!alreadyUpvoted) {
        review.upvotes.push(userId);
      }
      if (alreadyDownvoted) {
        review.downvotes = review.downvotes.filter(id => id !== userId);
      }

      review.save()
        .then(() => res.json({ message: 'Review upvoted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

// Endpoint to downvote a review
app.post('/api/reviews/:reviewId/downvote', (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.body.userId; // The ID of the user who is downvoting

  Review.findById(reviewId)
    .then(review => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Add userId to downvotes if not already there, and remove from upvotes if present
      const alreadyDownvoted = review.downvotes.includes(userId);
      const alreadyUpvoted = review.upvotes.includes(userId);
      if (!alreadyDownvoted) {
        review.downvotes.push(userId);
      }
      if (alreadyUpvoted) {
        review.upvotes = review.upvotes.filter(id => id !== userId);
      }

      review.save()
        .then(() => res.json({ message: 'Review downvoted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

//Endpoint to remove vote on review with id {reviewId} by user with id {userId}
app.post('/api/reviews/:reviewId/unvote', (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.body.userId; // The ID of the user who is retracting their vote

  Review.findById(reviewId)
    .then(review => {
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if the user has upvoted or downvoted and remove their vote
      const indexUpvote = review.upvotes.indexOf(userId);
      const indexDownvote = review.downvotes.indexOf(userId);
      let voteRemoved = false;

      if (indexUpvote > -1) {
        review.upvotes.splice(indexUpvote, 1); // Remove the user's upvote
        voteRemoved = true;
      }
      if (indexDownvote > -1) {
        review.downvotes.splice(indexDownvote, 1); // Remove the user's downvote
        voteRemoved = true;
      }

      if (!voteRemoved) {
        return res.status(400).json({ message: 'User has not voted on this review' });
      }

      review.save()
        .then(() => res.json({ message: 'Vote retracted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
    })
    .catch(err => res.status(500).json({ error: err.message }));
});

//Endpoint to get reviews for a specific show from following
app.get('/api/reviews/following/:userId/:showId', async (req, res) => {
  const userId = req.params.userId;
  const showId = req.params.showId;

  try {
    const user = await User.findById(userId).populate('following');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUsernames = user.following.map(followedUser => followedUser.username);

    const reviewsFromFollowing = await Review.find({
      username: { $in: followedUsernames },
      showId: showId // Filter by showId
    });

    res.json(reviewsFromFollowing);
  } catch (error) {
    console.error('Error fetching reviews from following:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


//POST a new user via the user's email provided in {req.body.email}
app.post('/register', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user)
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
    console.log(newUser)

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

//user login via {req.body.email} and checks for correct {req.body.password}
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

// Returns the userData queries via {username}
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

//Searches for matching users via the query {req.query.q}
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

//Posts edited information for user {username}, altering username, bio, first, and last names via req params
app.post('/edit/:username', async (req, res) => {
  const { username } = req.params;
  const { bio, first, last } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ username }, { bio, first: first, last: last }, { new: true });

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    console.error('Error updating bio:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Adds user {username} to following list of user {req.body.userId}
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

//Gets the following list of user {userId}
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

//Removes user {username} from following list of user {userId}
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

//Gets the followers of user {userId}
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

//Creates new season rating for user with id {userId}
app.post('/rateSeason', async (req, res) => {
  try {
    const { userId, showId, seasonNumber, rating, comment, status, episodes, reviewUserName, hours } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`);
    const showDetails = tmdbResponse.data;

    const showName = showDetails.name;

    const showImage = showDetails.poster_path

    const seasonRating = await SeasonRating.findOneAndUpdate(
      { user: userId, show: showId, season: seasonNumber },
      { $set: { rating: rating, comment: comment, status: status, episodes: episodes, hours: hours } },
      { new: true, upsert: true }
    );

    const review = await Review.findOne({
      username: reviewUserName,
      showId: showId // Filter by showId
    });

    console.log(review)

    const newActivity = new Activity({
      user: userId,
      type: 'rated',
      showId: showId,
      showName: showName,
      showImage: showImage,
      seasonNumber: seasonNumber,
      rating: rating,
      comment: comment,
      status: status,
      episodes: episodes,
      review: review,
      timestamp: new Date()
    });

    await newActivity.save();

    res.status(200).json({ message: 'Season rating and activity recorded successfully', seasonRating });
  } catch (error) {
    console.error('Error updating season rating and saving activity:', error);
    res.status(500).json({ message: 'Error updating season rating and saving activity' });
  }
});

//Deletes SeasonRating for show {showId} for user with id {userId}
app.post('/delSeason', async (req, res) => {
  try {
    const { userId, showId, seasonNumber } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    const deletionResultSeason = await SeasonRating.deleteOne({ user: userId, show: showId, season: seasonNumber });

    if (deletionResultSeason.deletedCount === 0) {
      return res.status(404).json({ message: 'Season rating not found for the given user and show' });
    }

    const deletionResultActivity = await Activity.deleteMany({ user: userId, showId: showId, seasonNumber: seasonNumber });

    if (deletionResultActivity.deletedCount === 0) {
      return res.status(404).json({ message: 'Activity not found for the given user and show' });
    }

    res.status(200).json({ message: 'Season rating removed successfully' });
  } catch (error) {
    console.error('Error removing season rating:', error);
    res.status(500).json({ message: 'Error removing season rating' });
  }
});

//Gets all the activities of user with id {userId}, sorted chronologically
app.get('/api/activities/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const activities = await Activity.find({ user: userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('user', 'username first profilePicture')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username first profilePicture'
        }
      })
      .populate({
        path: 'comments.replies',
        populate: {
          path: 'user',
          select: 'username first profilePicture'
        }
      })
      .populate({ path: 'review', select: '' })
      .lean();

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).send('Internal Server Error');
  }
});



//Gets all the seasonRatings of user with id {userId}
app.get('/api/seasonRatings/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const seasonRatings = await SeasonRating.find({ user: userId }).lean();
    if (!seasonRatings) {
      return res.status(404).json({ message: 'Season ratings not found' });
    }
    res.status(200).json(seasonRatings);
  } catch (error) {
    console.error('Error fetching season ratings:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Gets the activity feed of all the users that user with id {userId} follows
app.get('/api/followingFeed/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    console.log('Invalid or missing userId');
    return res.status(400).json({ message: 'Invalid or missing userId' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found for ID: ${userId}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const following = user.following;

    const activities = await Activity.find({
      user: { $in: following }
    }).sort({ timestamp: -1 }).populate('user', 'username first profilePicture').lean();

    res.status(200).json(activities);
  } catch (error) {
    console.error(`Error fetching following feed for userId ${userId}:`, error);
    res.status(500).send('Internal Server Error');
  }
});

//Likes activity with id {activityId} by user with id {req.body.userId}
app.post('/api/activities/:activityId/like', async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const userId = req.body.userId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send('Activity not found');
    }

    if (activity.likes.includes(userId)) {
      return res.status(400).send('You have already liked this activity');
    }

    activity.likes.push(userId);
    await activity.save();

    res.status(200).json({ message: 'Like added successfully' });
  } catch (error) {
    console.error('Error liking activity:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Unlikes activity with id {activityId} by user with Id {userId}
app.post('/api/activities/:activityId/unlike', async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const userId = req.body.userId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send('Activity not found');
    }

    if (!activity.likes.includes(userId)) {
      return res.status(400).send('You have not liked this activity');
    }

    activity.likes.pull(userId);
    await activity.save();

    res.status(200).json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error unliking activity:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Post a new comment to the activity with id {activityId}
app.post('/api/activities/:activityId/comment', async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const { userId, comment } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send('Activity not found');
    }

    const newComment = new Comment({
      user: userId,
      username: user.username,
      profilePicture: user.profilePicture,
      first: user.first,
      comment: comment
    });

    const savedComment = await newComment.save();

    activity.comments.push(savedComment._id);
    await activity.save();

    res.status(200).json({ message: 'Comment added successfully', newComment: savedComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Get all the comments from activity with id {activityId}, sorted chronologically
app.get('/api/activities/:activityId/comments', async (req, res) => {
  try {
    const activityId = req.params.activityId;

    const activity = await Activity.findById(activityId).populate({
      path: 'comments',
      model: 'Comment',
      options: { sort: { 'createdAt': -1 } },
      populate: [
        {
          path: 'user',
          model: 'User',
          select: 'username profilePicture'
        },
        {
          path: 'replies',
          model: 'Comment',
          populate: {
            path: 'user',
            model: 'User',
            select: 'username profilePicture'
          }
        }
      ]
    });

    if (!activity) {
      return res.status(404).send('Activity not found');
    }

    res.status(200).json(activity.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Internal Server Error');
  }
});


//Delete a comment with id {commentId} from activity with id {activityId}
app.delete('/api/activities/:activityId/comment/:commentId', async (req, res) => {
  try {
    const activityId = req.params.activityId;
    const commentId = req.params.commentId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send('Activity not found');
    }

    const commentIndex = activity.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).send('Comment not found');
    }

    activity.comments.splice(commentIndex, 1);
    await activity.save();

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Get's following recommendations for user with name {username}
app.get('/api/recommendations/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).populate('following');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let recommendations = {};
    let commonFollowersMap = {}; // Map to store common followers for each recommended user

    for (const followedUser of user.following) {
      const followedUserData = await User.findById(followedUser._id).populate('following');

      for (const potentialRecommendation of followedUserData.following) {
        if (!user.following.includes(potentialRecommendation._id) && potentialRecommendation._id.toString() !== user._id.toString()) {
          const recommendationId = potentialRecommendation._id.toString();
          recommendations[recommendationId] = (recommendations[recommendationId] || 0) + 1;

          if (!commonFollowersMap[recommendationId]) {
            commonFollowersMap[recommendationId] = [];
          }
          commonFollowersMap[recommendationId].push(followedUser.username);
        }
      }
    }

    const sortedRecommendations = Object.keys(recommendations)
      .sort((a, b) => recommendations[b] - recommendations[a])
      .slice(0, 3);

    let topRecommendations = await User.find({ '_id': { $in: sortedRecommendations } }).select('-passwordHash');

    // Append the common_followers data
    topRecommendations = topRecommendations.map(user => {
      return {
        ...user.toObject(),
        common_followers: commonFollowersMap[user._id.toString()] || []
      };
    });

    res.json(topRecommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Like a comment with id {commentId} by user with id {userId}
app.post('/api/activities/comment/:commentId/like', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.error('Comment not found');
      return res.status(404).send('Comment not found');
    }

    if (comment.likes.includes(userId)) {
      return res.status(400).send('You have already liked this comment');
    }

    comment.likes.push(userId);
    await comment.save();

    res.status(200).json({ message: 'Like added successfully' });
  } catch (error) {
    console.error('Error liking comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Unlike a comment with id {commentId} by user with id {userId}
app.post('/api/activities/comment/:commentId/unlike', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      console.error('Comment not found');
      return res.status(404).send('Comment not found');
    }

    if (!comment.likes.includes(userId)) {
      return res.status(400).send('You have not liked this comment');
    }

    comment.likes = comment.likes.filter(likeUserId => likeUserId.toString() !== userId.toString());
    await comment.save();

    res.status(200).json({ message: 'Unlike successful' });
  } catch (error) {
    console.error('Error unliking comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

//Get the shows seen by following list of user with id {userId} 
app.get('/api/following/shows/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate('following');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const seasonRatings = await SeasonRating.find({ user: userId });

    if (!seasonRatings) {
      return res.status(404).json({ message: 'Season ratings not found' });
    }

    let showData = {};

    for (const followedUser of user.following) {
      const seasonRatingsFollowedUser = await SeasonRating.find({ user: followedUser._id });

      for (const potentialRecommendation of seasonRatingsFollowedUser) {

        if (!showData[potentialRecommendation.show]) {
          showData[potentialRecommendation.show] = { cumulativeRating: 0, users: [] };
        }
        showData[potentialRecommendation.show].cumulativeRating += potentialRecommendation.rating;
        showData[potentialRecommendation.show].users.push(followedUser.username);
      }
    }

    const sortedRecommendations = Object.entries(showData).sort((a, b) => b[1].cumulativeRating - a[1].cumulativeRating);

    res.json(sortedRecommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: "Internal Server Error" });

  }
});

//Reply to a comment by creating a new comment and linking it to the original comment
app.post('/api/activities/comment/:commentId/reply', async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, replyContent } = req.body;

    const originalComment = await Comment.findById(commentId);
    if (!originalComment) {
      console.error('Comment not found');
      return res.status(404).send('Comment not found');
    }

    const replyComment = new Comment({
      user: userId,
      comment: replyContent,
    });

    const savedReply = await replyComment.save();
    originalComment.replies.push(savedReply._id);

    await originalComment.save();

    const updatedOriginalComment = await Comment.findById(commentId)
      .populate('replies')

    res.status(200).json(updatedOriginalComment);
  } catch (error) {
    console.error('Error replying to comment:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Like a reply with id {replyId} by user with id {userId}
app.post('/api/activities/comment/:commentId/reply/:replyId/like', async (req, res) => {
  try {
    const { replyId } = req.params;
    const { userId } = req.body;

    const reply = await Comment.findById(replyId);
    if (!reply) {
      console.error('Reply not found');
      return res.status(404).send('Reply not found');
    }

    if (reply.likes.includes(userId)) {
      return res.status(400).send('You have already liked this reply');
    }

    reply.likes.push(userId);
    await reply.save();

    res.status(200).json({ message: 'Like added successfully to reply' });
  } catch (error) {
    console.error('Error liking reply:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Unlike a reply with id {replyId} by user with id {userId}
app.post('/api/activities/comment/:commentId/reply/:replyId/unlike', async (req, res) => {
  try {
    const { replyId } = req.params;
    const { userId } = req.body;

    const reply = await Comment.findById(replyId);
    if (!reply) {
      console.error('Reply not found');
      return res.status(404).send('Reply not found');
    }

    if (!reply.likes.includes(userId)) {
      return res.status(400).send('You have not liked this reply');
    }

    reply.likes = reply.likes.filter(likeUserId => likeUserId.toString() !== userId.toString());
    await reply.save();

    res.status(200).json({ message: 'Unlike successful for reply' });
  } catch (error) {
    console.error('Error unliking reply:', error);
    res.status(500).send('Internal Server Error');
  }
});