const User = require("../models/User");
const SeasonRating = require("../models/SeasonRating");
const Activity = require("../models/Activity");
const axios = require("axios");

async function getShowGenres(showId) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/tv/${showId}?api_key=${process.env.TMDB_API_KEY}`
    );
    return response.data.genres.map((genre) => genre.name);
  } catch (error) {
    console.error("Error fetching show genres:", error);
    return [];
  }
}

//Get user stats by username
const getUserStatsByUsername = async (req, res) => {
    try {
      const { username } = req.params;
  
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const seasonRatings = await SeasonRating.find({ user: user._id });
  
      const totalShows = seasonRatings.length;
      const totalEpisodes = seasonRatings.reduce((sum, rating) => {
  
        if (typeof rating.episodes === "string") {
          const episodesWatched = rating.episodes.match(/\d+/);
          return sum + (episodesWatched ? parseInt(episodesWatched[0], 10) : 0);
        }
        return sum;
      }, 0);
      const totalHours = seasonRatings.reduce(
        (sum, rating) => sum + (rating.hours || 0),
        0
      );
      const averageRating =
        seasonRatings.reduce((sum, rating) => sum + rating.rating, 0) /
        totalShows;
  
      const currentYear = new Date().getFullYear();
  
      const monthlyActivity = await Activity.aggregate([
        {
          $match: {
            user: user._id,
            timestamp: {
              $gte: new Date(`${currentYear}-01-01`),
              $lt: new Date(`${currentYear + 1}-01-01`),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$timestamp" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);
  
      let monthlyCounts = Array(12).fill(0);
      monthlyActivity.forEach((activity) => {
        const monthIndex = activity._id.month - 1;
        monthlyCounts[monthIndex] = activity.count;
      });
  
      const genreRatings = {};
      for (const rating of seasonRatings) {
        const genres = await getShowGenres(rating.show);
        genres.forEach((genre) => {
          if (!genreRatings[genre]) {
            genreRatings[genre] = { totalRating: 0, count: 0 };
          }
          genreRatings[genre].totalRating += rating.rating;
          genreRatings[genre].count += 1;
        });
      }
  
      let favoriteGenre = "None";
      let highestAverage = 0;
      for (const [genre, data] of Object.entries(genreRatings)) {
        const averageRating = data.totalRating / data.count;
        if (averageRating > highestAverage) {
          highestAverage = averageRating;
          favoriteGenre = genre;
        }
      }
  
      let highestRatedShow = { showId: null, showName: "None", highestRating: 0 };
      for (const rating of seasonRatings) {
        if (rating.rating > highestRatedShow.highestRating) {
          highestRatedShow = {
            showId: rating.show,
            highestRating: rating.rating,
            showName: undefined,
          };
        }
      }
  
      if (highestRatedShow.showId) {
        try {
          const showResponse = await axios.get(
            `https://api.themoviedb.org/3/tv/${highestRatedShow.showId}?api_key=${process.env.TMDB_API_KEY}`
          );
          highestRatedShow.showName = showResponse.data.name;
          highestRatedShow.showDetails = showResponse.data;
        } catch (apiError) {
          console.error("Error fetching show details:", apiError);
          highestRatedShow.showName = "Unknown";
        }
      }
  
      res.json({
        username: username,
        totalShows: totalShows,
        totalEpisodes: totalEpisodes,
        totalHours: totalHours.toFixed(2),
        averageRating: isNaN(averageRating) ? 0 : averageRating.toFixed(2),
        monthlyActivity: monthlyCounts,
        favoriteGenre: favoriteGenre,
        highestRatedShow: highestRatedShow,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// Get user by username
const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Search for users by query
const searchUsers = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    const regex = new RegExp(searchQuery, "i");
    const users = await User.find({ username: { $regex: regex } }).select("-passwordHash");
    res.json(users);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Edit user information
const editUser = async (req, res) => {
  const { username } = req.params;
  const { bio, first, last } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { bio, first, last },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Follow a user
const followUser = async (req, res) => {
  const { username } = req.params;
  const { userId } = req.body;

  try {
    const userToFollow = await User.findOne({ username });
    const currentUser = await User.findById(userId);

    if (!userToFollow || !currentUser) {
      return res.status(404).send("User not found");
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).send("You are already following this user");
    }

    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    const updatedUser = await User.findById(userId).populate("following");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
  const { username } = req.params;
  const { userId } = req.body;

  try {
    const userToUnfollow = await User.findOne({ username });
    const currentUser = await User.findById(userId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).send("User not found");
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).send("You are not following this user");
    }

    currentUser.following.pull(userToUnfollow._id);
    await currentUser.save();

    userToUnfollow.followers.pull(currentUser._id);
    await userToUnfollow.save();

    const updatedUser = await User.findById(userId).populate("following");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get following list
const getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("following");
    res.status(200).json(user.following);
  } catch (error) {
    console.error("Error getting following list:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Get followers list
const getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate("followers");
    res.status(200).json(user.followers);
  } catch (error) {
    console.error("Error getting followers list:", error);
    res.status(500).send("Internal Server Error");
  }
};

//Get the shows seen by following list of user with id {userId}
const getFollowingShowList = async (req, res) =>{
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ _id: userId }).populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const seasonRatings = await SeasonRating.find({ user: userId });

    if (!seasonRatings) {
      return res.status(404).json({ message: "Season ratings not found" });
    }

    let showData = {};

    for (const followedUser of user.following) {
      const seasonRatingsFollowedUser = await SeasonRating.find({
        user: followedUser._id,
      });

      for (const potentialRecommendation of seasonRatingsFollowedUser) {
        if (!showData[potentialRecommendation.show]) {
          showData[potentialRecommendation.show] = {
            cumulativeRating: 0,
            users: [],
          };
        }
        showData[potentialRecommendation.show].cumulativeRating +=
          potentialRecommendation.rating;
        showData[potentialRecommendation.show].users.push(
          followedUser.username
        );
      }
    }

    const sortedRecommendations = Object.entries(showData).sort(
      (a, b) => b[1].cumulativeRating - a[1].cumulativeRating
    );

    res.json(sortedRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

//Get's following recommendations for user with name {username}
const getFollowingRecommendations = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username }).populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let recommendations = {};
    let commonFollowersMap = {}; // Map to store common followers for each recommended user

    for (const followedUser of user.following) {
      const followedUserData = await User.findById(followedUser._id).populate(
        "following"
      );

      for (const potentialRecommendation of followedUserData.following) {
        if (
          !user.following.includes(potentialRecommendation._id) &&
          potentialRecommendation._id.toString() !== user._id.toString()
        ) {
          const recommendationId = potentialRecommendation._id.toString();
          recommendations[recommendationId] =
            (recommendations[recommendationId] || 0) + 1;

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

    let topRecommendations = await User.find({
      _id: { $in: sortedRecommendations },
    }).select("-passwordHash");

    // Append the common_followers data
    topRecommendations = topRecommendations.map((user) => {
      return {
        ...user.toObject(),
        common_followers: commonFollowersMap[user._id.toString()] || [],
      };
    });

    res.json(topRecommendations);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  getUserStatsByUsername,
  getUserByUsername,
  searchUsers,
  editUser,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowingShowList,
  getFollowingRecommendations
};
