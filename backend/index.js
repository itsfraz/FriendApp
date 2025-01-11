const express = require('express');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types; // Import ObjectId correctly
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const FriendRequest = require('./models/FriendRequest');
const multer = require('multer');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Middleware for authentication (if needed)
  socket.use((packet, next) => {
    // Add token validation logic if required
    next();
  });

  // Handle user login
  socket.on('user-login', async (userId) => {
    try {
      // Update the user's socketId in the database
      await User.findByIdAndUpdate(userId, { socketId: socket.id });
      console.log(`User ${userId} is now online with socket ID:`, socket.id);
    } catch (error) {
      console.error('Error updating user socket ID:', error);
      socket.emit('error', { message: 'Internal server error. Please try again.' });
    }
  });

  // Sending friend request
  socket.on('send-friend-request', async ({ fromUserId, toUserId }) => {
    console.log('Friend request sent from:', fromUserId, 'to:', toUserId);
    try {
      const recipient = await User.findById(toUserId);
      if (recipient && recipient.socketId) {
        io.to(recipient.socketId).emit('new-friend-request', {
          fromUserId,
          message: 'You have a new friend request!',
        });
      } else {
        console.log('Recipient is offline. Consider queuing notifications.');
        // Implement queuing logic for offline users
      }
    } catch (error) {
      console.error('Error in send-friend-request:', error);
      socket.emit('error', { message: 'Could not send friend request.' });
    }
  });

  // Accepting friend request
  socket.on('accept-friend-request', async ({ fromUserId, toUserId }) => {
    console.log('Friend request accepted by:', toUserId, 'from:', fromUserId);
    try {
      const sender = await User.findById(fromUserId);
      if (sender && sender.socketId) {
        io.to(sender.socketId).emit('friend-request-accepted', {
          toUserId,
          message: 'Your friend request has been accepted!',
        });
      } else {
        console.log('Sender is offline. Consider queuing notifications.');
      }
    } catch (error) {
      console.error('Error in accept-friend-request:', error);
      socket.emit('error', { message: 'Could not process the request.' });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', async () => {
    console.log('User disconnected:', socket.id);
    try {
      await User.updateOne({ socketId: socket.id }, { $unset: { socketId: '' } });
    } catch (error) {
      console.error('Error during user disconnect cleanup:', error);
    }
  });
});


// Sign Up Route
app.post('/signup', upload.single('profilePicture'), async (req, res) => {
  const { username, password, name, email } = req.body;
  const profilePicture = req.file ? req.file.path : ''; // Get the file path

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Validate the password using the regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      name,
      email,
      profilePicture, // Save the file path in the database
    });

    await newUser.save(); // Save the new user to the database

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Return error if user doesn't exist
    }

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' }); // Return error if password is incorrect
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(200).json({ token, userId: user._id }); // Return token and user ID
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' }); // Handle server errors
  }
});

// Search Users Route
app.get('/search-users', async (req, res) => {
  const { query, userId } = req.query; // Get the search query and userId from the URL

  try {
    // Find the logged-in user and get their friends list
    const user = await User.findById(userId).populate('friends');
    const friendIds = user.friends.map(friend => friend._id); // Extract friend IDs

    // Find users whose username matches the query (case-insensitive) and are not already friends
    const users = await User.find({
      username: { $regex: query, $options: 'i' }, // Case-insensitive search
      _id: { $nin: [...friendIds, userId] }, // Exclude the user and their friends
    }, 'username name profilePicture'); // Return username, name, and profilePicture

    res.status(200).json(users); // Return the list of matching users
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' }); // Handle server errors
  }
});

// Send Friend Request Route
app.post('/send-friend-request', async (req, res) => {
  const { fromUserId, toUserId } = req.body; // Get sender and receiver IDs from the request body

  try {
    console.log("Sending friend request from:", fromUserId, "to:", toUserId); // Debugging

    // Check if the users are already friends
    const fromUser = await User.findById(fromUserId);
    if (fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ message: 'You are already friends with this user.' });
    }

    // Check if a pending request already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId },
      ],
      status: { $in: ['pending', 'accepted'] }, // Check for pending or accepted requests
    });

    if (existingRequest) {
      if (existingRequest.status === 'pending') {
        return res.status(400).json({ message: 'Friend request already sent or received.' });
      }
      if (existingRequest.status === 'accepted') {
        return res.status(400).json({ message: 'You are already friends with this user.' });
      }
    }

    // Create a new friend request
    const newRequest = new FriendRequest({ from: fromUserId, to: toUserId });
    await newRequest.save(); // Save the new friend request to the database

    console.log("Friend request saved successfully:", newRequest); // Debugging

    // Emit a notification to the recipient
    const recipient = await User.findById(toUserId);
    if (recipient && recipient.socketId) {
      io.to(recipient.socketId).emit('new-friend-request', {
        fromUserId,
        message: 'You have a new friend request!',
      });
    }

    res.status(201).json({ message: 'Friend request sent successfully' }); // Return success message
  } catch (err) {
    console.error("Error sending friend request:", err); // Debugging
    res.status(500).json({ message: 'Something went wrong' }); // Handle server errors
  }
});

// Respond to Friend Request Route
app.post('/respond-friend-request', async (req, res) => {
  const { requestId, status } = req.body; // status can be 'accepted' or 'rejected'

  try {
    console.log("Responding to friend request ID:", requestId, "with status:", status); // Debugging

    // Find the friend request
    const request = await FriendRequest.findById(requestId);
    if (!request) {
      console.log("Friend request not found:", requestId); // Debugging
      return res.status(404).json({ message: 'Friend request not found' }); // Return error if request doesn't exist
    }

    // Update the request status
    request.status = status;
    await request.save(); // Save the updated request

    console.log("Friend request updated successfully:", request); // Debugging

    // If the request is accepted, add each user to the other's friends list
    if (status === 'accepted') {
      await User.findByIdAndUpdate(request.from, { $push: { friends: request.to } }); // Add receiver to sender's friends list
      await User.findByIdAndUpdate(request.to, { $push: { friends: request.from } }); // Add sender to receiver's friends list

      console.log("Users added to each other's friends list:", request.from, request.to); // Debugging

      // Emit a notification to the sender
      const sender = await User.findById(request.from);
      if (sender && sender.socketId) {
        io.to(sender.socketId).emit('friend-request-accepted', {
          toUserId: request.to,
          message: 'Your friend request has been accepted!',
        });
      }
    }

    res.status(200).json({ message: 'Friend request updated successfully' }); // Return success message
  } catch (err) {
    console.error("Error responding to friend request:", err); // Debugging
    res.status(500).json({ message: 'Something went wrong' }); // Handle server errors
  }
});

// Fetch Pending Friend Requests Route
app.get('/pending-friend-requests/:userId', async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL

  try {
    console.log("Fetching pending friend requests for user:", userId); // Debugging

    // Find all pending requests where the user is the recipient
    const requests = await FriendRequest.find({ to: userId, status: 'pending' })
      .populate('from'); // Populate the 'from' field with the full sender user document

    console.log("Pending friend requests fetched:", requests); // Debugging

    res.status(200).json(requests); // Return the list of pending requests
  } catch (err) {
    console.error("Error fetching pending friend requests:", err); // Debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Friend Recommendations Route
app.get('/friend-recommendations/:userId', async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL

  try {
    // Convert userId to ObjectId
    const userIdObjectId = new ObjectId(userId); // Use 'new' keyword

    // Get the user's friends
    const user = await User.findById(userIdObjectId).populate('friends');
    const friendIds = user.friends.map(friend => friend._id); // Extract friend IDs

    // Get pending friend requests involving the user
    const pendingRequests = await FriendRequest.find({
      $or: [{ from: userIdObjectId }, { to: userIdObjectId }],
      status: 'pending',
    });

    // Extract user IDs involved in pending requests
    const pendingUserIds = pendingRequests.map(request =>
      request.from.equals(userIdObjectId) ? request.to : request.from
    );

    // Debugging: Log excluded user IDs
    console.log("Excluding user IDs:", [...friendIds, userIdObjectId, ...pendingUserIds]);

    // Find users who are friends of the user's friends but not already friends with the user
    const recommendations = await User.aggregate([
      {
        $match: {
          _id: { $nin: [...friendIds, userIdObjectId, ...pendingUserIds] }, // Exclude the user, their friends, and users with pending requests
          friends: { $in: friendIds }, // Users who are friends with the user's friends
        },
      },
      {
        $project: {
          username: 1,
          name: 1,
          profilePicture: 1,
          mutualFriends: {
            $size: {
              $setIntersection: ['$friends', friendIds], // Calculate the number of mutual friends
            },
          },
        },
      },
      {
        $sort: { mutualFriends: -1 }, // Sort by mutual friends (descending)
      },
      {
        $limit: 10, // Limit the number of recommendations
      },
    ]);

    res.status(200).json(recommendations); // Return the list of recommended users
  } catch (err) {
    console.error("Error fetching friend recommendations:", err); // Debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Fetch Friend List Route
app.get('/friend-list/:userId', async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL

  try {
    // Find the user and populate the 'friends' field with name, profilePicture, and username
    const user = await User.findById(userId).populate('friends', 'username name profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user doesn't exist
    }

    res.status(200).json(user.friends); // Return the list of friends with name and profilePicture
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' }); // Handle server errors
  }
});

// Unfriend Route
app.post('/unfriend', async (req, res) => {
  const { userId, friendId } = req.body; // Get user ID and friend ID from the request body

  try {
    // Remove the friend from the user's friends list
    await User.findByIdAndUpdate(userId, { $pull: { friends: friendId } });

    // Remove the user from the friend's friends list
    await User.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    res.status(200).json({ message: 'Unfriended successfully' }); // Return success message
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' }); // Handle server errors
  }
});

// Fetch User by ID Route
app.get('/user/:userId', async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL

  try {
    console.log("Fetching user with ID:", userId); // Debugging

    // Find user by ID and return name, profilePicture, and username
    const user = await User.findById(userId, 'username name profilePicture');

    if (!user) {
      console.log("User not found:", userId); // Debugging
      return res.status(404).json({ message: 'User not found' }); // Return error if user doesn't exist
    }

    console.log("User fetched successfully:", user); // Debugging
    res.status(200).json(user); // Return the user object with name, profilePicture, and username
  } catch (err) {
    console.error("Error fetching user:", err); // Debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete User Profile Route
app.delete('/delete-profile/:userId', async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL

  try {
    console.log("Deleting user with ID:", userId); // Debugging

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId); // Debugging
      return res.status(404).json({ message: 'User not found' }); // Return error if user doesn't exist
    }

    // Delete all friend requests involving this user
    await FriendRequest.deleteMany({
      $or: [{ from: userId }, { to: userId }],
    });

    // Remove the user from all friends lists
    await User.updateMany(
      { friends: userId },
      { $pull: { friends: userId } }
    );

    // Delete the user
    await User.findByIdAndDelete(userId);

    console.log("User deleted successfully:", userId); // Debugging
    res.status(200).json({ message: 'Profile deleted successfully' }); // Return success message
  } catch (err) {
    console.error("Error deleting user profile:", err); // Debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Profile Update route
app.put('/edit-profile/:userId', upload.single('profilePicture'), async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;
  const profilePicture = req.file ? req.file.path : '';

  try {
    const updateData = { name, email };
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Change Password Route
app.post('/change-password/:userId', async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Validate the new password
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});