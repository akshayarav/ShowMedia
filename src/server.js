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

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

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

const seasonRatingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  show: Number,
  season: Number,
  rating: Number,
  comment: String,
  status: String,
  episodes: String,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const SeasonRating = mongoose.model('SeasonRating', seasonRatingSchema);

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
  timestamp: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Activity = mongoose.model('Activity', activitySchema);

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

app.post('/rateSeason', async (req, res) => {
  try {
    const { userId, showId, seasonNumber, rating, comment, status, episodes } = req.body;
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
      { $set: { rating: rating, comment: comment, status: status, episodes: episodes } },
      { new: true, upsert: true }
    );

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
      timestamp: new Date()
    });

    await newActivity.save();

    res.status(200).json({ message: 'Season rating and activity recorded successfully', seasonRating });
  } catch (error) {
    console.error('Error updating season rating and saving activity:', error);
    res.status(500).json({ message: 'Error updating season rating and saving activity' });
  }
});

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
      .lean();

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).send('Internal Server Error');
  }
});

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


app.get('/api/get/activity/:activityId', async (req, res) => {
  try {
    const activityId = req.params.activityId;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).send('Activity not found');
    }

    res.status(200).json(activity.toObject());
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).send('Internal Server Error');
  }
})

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

    // Find the reply comment by its ID
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

    // Find the reply comment by its ID
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