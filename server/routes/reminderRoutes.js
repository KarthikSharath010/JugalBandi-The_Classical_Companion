const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Reminder = require('../models/Reminder');

// Handle OPTIONS preflight
router.options('*', (req, res) => {
  res.status(200).send();
});

// Get reminders for the authenticated user
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const reminders = await Reminder.find({ userId: decoded.id });
    res.json({ reminders });
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new reminder
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, description, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ message: 'Title and due date are required' });
    }
    const reminder = new Reminder({
      userId: decoded.id,
      title,
      description,
      dueDate: new Date(dueDate)
    });
    await reminder.save();
    res.status(201).json({ reminder });
  } catch (err) {
    console.error('Error creating reminder:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;