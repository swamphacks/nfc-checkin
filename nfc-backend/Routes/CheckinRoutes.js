const express = require('express');
const router = express.Router();
const { checkinUser } = require('../Controllers/CheckinController');

router.post('/nfc-links', checkinUser);

module.exports = router;
