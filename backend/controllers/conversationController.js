const Conversation = require('../models/Conversation');
const User = require('../models/User');

// GET endpoint to fetch a conversation between two users
const getConversation = async (req, res) => {
    try {
      const { userId1, userId2 } = req.query;
  
      const conversation = await Conversation.findOne({
        participants: { $all: [userId1, userId2] },
      }).exec();
  
      if (!conversation) {
        return res.status(404).send("Conversation not found");
      }
  
      res.json(conversation);
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).send("Server error: " + error.message);
    }
  };

// GET endpoint to fetch conversations for a user
const getUserConversations = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const conversations = await Conversation.find({ participants: userId })
        .sort({ updatedAt: -1 })
        .populate("participants", "username")
        .exec();
  
      res.json(conversations);
    } catch (error) {
      res.status(500).send("Server error: " + error.message);
    }
  };

  // POST endpoint to create a new conversation
const createConversation = async (req, res) => {
    try {
      const { userId1, userId2 } = req.body;
  
      const user1 = await User.findById(userId1);
      const user2 = await User.findById(userId2);
      if (!user1 || !user2) {
        return res.status(404).send("One or both users not found");
      }
  
      let conversation = await Conversation.findOne({
        participants: { $all: [userId1, userId2] },
      });
  
      if (conversation) {
        return res.json(conversation);
      } else {
        conversation = new Conversation({
          participants: [userId1, userId2],
          messages: [],
        });
  
        await conversation.save();
  
        res.status(201).json(conversation);
      }
    } catch (error) {
      res.status(500).send("Server error: " + error.message);
    }
  };


module.exports = { getConversation, getUserConversations, createConversation };