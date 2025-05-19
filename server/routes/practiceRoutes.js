const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Practice = require('../models/Practice');

// Handle OPTIONS preflight
router.options('*', (req, res) => {
  res.status(200).send();
});

// Get all practices for the authenticated user
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const practices = await Practice.find({ userId: decoded.id });
    res.json({ practices });
  } catch (err) {
    console.error('Error fetching practices:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new practice
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { date, duration, description } = req.body;
    if (!date || !duration) {
      return res.status(400).json({ message: 'Date and duration are required' });
    }
    const practice = new Practice({
      userId: decoded.id,
      date: new Date(date),
      duration: Number(duration),
      description
    });
    await practice.save();
    res.status(201).json({ practice, message: 'Practice logged successfully' });
  } catch (err) {
    console.error('Error creating practice:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a practice
router.put('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { date, duration, description } = req.body;
    if (!date || !duration) {
      return res.status(400).json({ message: 'Date and duration are required' });
    }
    const practice = await Practice.findOneAndUpdate(
      { _id: req.params.id, userId: decoded.id },
      { date: new Date(date), duration: Number(duration), description },
      { new: true }
    );
    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }
    res.json({ practice, message: 'Practice updated successfully' });
  } catch (err) {
    console.error('Error updating practice:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a practice
router.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const practice = await Practice.findOneAndDelete({
      _id: req.params.id,
      userId: decoded.id
    });
    if (!practice) {
      return res.status(404).json({ message: 'Practice not found' });
    }
    res.json({ message: 'Practice deleted successfully' });
  } catch (err) {
    console.error('Error deleting practice:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;