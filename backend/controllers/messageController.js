const { get } = require('mongoose');
const Message = require('../models/Message')
const Conversation = require('../models/Conversation')

// GET endpoint to fetch a message by its ID
const getMessage = async (req, res) => {
    try {
      const messageId = req.params.messageId;
  
      const message = await Message.findById(messageId).exec();
  
      if (!message) {
        return res.status(404).send("Message not found");
      }
  
      res.json(message);
    } catch (error) {
      console.error("Error fetching message:", error);
      res.status(500).send("Server error: " + error.message);
    }
  };
  
// POST endpoint for sending a message
const sendMessage = async (req, res) => {
try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
    return res.status(400).send("Missing required fields");
    }

    const newMessage = new Message({
    sender,
    receiver,
    message,
    });

    await newMessage.save();

    let conversation = await Conversation.findOne({
    participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
    conversation = new Conversation({
        participants: [sender, receiver],
        messages: [],
    });
    }

    conversation.messages.push(newMessage._id);

    await conversation.save();

    res.status(201).send("Message sent successfully");
} catch (error) {
    res.status(500).send("Server error: " + error.message);
}
};

module.exports = { getMessage, sendMessage }; 