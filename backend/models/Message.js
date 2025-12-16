const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    // required: true, // Made optional because a message might be just an image
  },
  image: {
    type: String, // Path to the uploaded image
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
