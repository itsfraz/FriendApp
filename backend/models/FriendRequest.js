const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  from: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    validate: {
      validator: async function (value) {
        console.log("Validating 'from' user ID:", value); // Debugging
        // Check if the 'from' user exists in the User collection
        const user = await mongoose.model('User').findById(value);
        const isValid = user !== null;
        console.log("Validation result for 'from' user ID:", isValid); // Debugging
        return isValid;
      },
      message: 'Invalid user ID for "from" field. User does not exist.',
    },
  }, // User who sent the request
  to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    validate: {
      validator: async function (value) {
        console.log("Validating 'to' user ID:", value); // Debugging
        // Check if the 'to' user exists in the User collection
        const user = await mongoose.model('User').findById(value);
        const isValid = user !== null;
        console.log("Validation result for 'to' user ID:", isValid); // Debugging
        return isValid;
      },
      message: 'Invalid user ID for "to" field. User does not exist.',
    },
  }, // User who received the request
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected'], 
    default: 'pending', 
    required: true, 
  }, // Request status
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Prevent duplicate friend requests
friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

// Middleware to ensure 'from' and 'to' are not the same user
friendRequestSchema.pre('save', async function (next) {
  console.log("Checking if 'from' and 'to' are the same user..."); // Debugging
  if (this.from.equals(this.to)) {
    console.log("Error: Cannot send a friend request to yourself."); // Debugging
    const error = new Error('You cannot send a friend request to yourself.');
    return next(error);
  }
  console.log("'from' and 'to' are different users. Proceeding to save."); // Debugging
  next();
});

module.exports = mongoose.model('FriendRequest', friendRequestSchema);