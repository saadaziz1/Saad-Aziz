const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get portfolio
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.holdings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update portfolio
router.post('/', auth, async (req, res) => {
  try {
    const { holdings } = req.body;
    await User.findByIdAndUpdate(req.userId, { holdings });
    res.json({ message: 'Portfolio updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;