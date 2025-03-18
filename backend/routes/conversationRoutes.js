const express = require('express')
const { getConversation, getUserConversations, createConversation } = require('../controllers/conversationController')

const router = express.Router()

router.get('/find', getConversation);
router.get('/:userId', getUserConversations);
router.post('/create', createConversation);

module.exports = router;
