const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// Handle OPTIONS preflight
router.options('*', (req, res) => {
  res.status(200).send();
});

// Get lessons by role and level
router.get('/', async (req, res) => {
  try {
    const { role, level } = req.query;
    if (!role || !level) {
      return res.status(400).json({ message: 'Role and level are required' });
    }
    const lessons = await Lesson.find({ role, level });
    res.json({ lessons });
  } catch (err) {
    console.error('Error fetching lessons:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;