const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }, // Add name field
  email: { type: String, required: true, unique: true }, // Add email field
  profilePicture: { type: String, default: '' }, // Add profile picture field (URL or file path)
  ocketId: { type: String, default: '' }, // Add this field
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);