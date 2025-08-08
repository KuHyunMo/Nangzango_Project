const express = require('express');
const router = express.Router();
const Tip = require('../models/Tip');

// GET /api/tips/random
router.get('/random', async (req, res) => {
  const count = await Tip.countDocuments();
  const rand  = Math.floor(Math.random() * count);
  const tip   = await Tip.findOne().skip(rand);
  res.json({ message: tip?.message || '' });
});

module.exports = router;
