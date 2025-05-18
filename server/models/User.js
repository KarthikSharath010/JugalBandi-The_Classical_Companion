const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['Dancer', 'Instrumentalist', 'Both'], required: true },
  level: { type: String, enum: ['Beginner', 'Junior', 'Senior'], required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
