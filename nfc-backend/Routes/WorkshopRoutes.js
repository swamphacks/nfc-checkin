const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  tagToWorkshop,
} = require('../Controllers/WorkshopController');

router.get('/workshops', getWorkshops);

router.post('/tag-workshop', tagToWorkshop);

module.exports = router;
