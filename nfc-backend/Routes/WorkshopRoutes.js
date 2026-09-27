const express = require('express');
const router = express.Router();
const {
  getWorkshops,
  tagToWorkshop,
  getSocials,
} = require('../Controllers/WorkshopController');

router.get('/workshops', getWorkshops);
router.get('/socials', getSocials);

router.post('/tag', tagToWorkshop);

module.exports = router;
