const express = require("express");
const {
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
} = require("../controllers/userController");

const router = express.Router();

// Define routes
router.get('/stats/:username', getUserStatsByUsername);
router.get("/search", searchUsers); // Search users
router.post("/edit/:username", editUser); // Edit user details
router.post("/follow/:username", followUser); // Follow a user
router.post("/unfollow/:username", unfollowUser); // Unfollow a user
router.get("/following/:userId", getFollowing); // Get following list
router.get("/followers/:userId", getFollowers); // Get followers list
router.get("/following/shows/:userId", getFollowingShowList); // Get shows seen by following list
router.get("/recommendations/:username", getFollowingRecommendations); // Get recommendations for user
router.get("/:username", getUserByUsername); // GET user by username



module.exports = router;