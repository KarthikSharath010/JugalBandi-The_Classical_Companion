const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  role: { type: String, enum: ['Dancer', 'Instrumentalist', 'Both'], required: true },
  level: { type: String, enum: ['Beginner', 'Junior', 'Senior'], required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lesson', lessonSchema);