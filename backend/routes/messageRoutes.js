const express = require('express')
const { getMessage, sendMessage } = require('../controllers/messageController')

const router = express.Router()

router.get('/:messageId', getMessage);
router.post('/send', sendMessage);

module.exports = router;
