const express = require('express');
const router = express.Router();
const {
  getMeals,
  tagRedeemable,
  getTshirts,
} = require('../Controllers/RedeemableController');

router.get('/meals', getMeals);
router.post('/tag', tagRedeemable);
router.get('/Tshirt', getTshirts);

module.exports = router;
