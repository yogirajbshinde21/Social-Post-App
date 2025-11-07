const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('username').optional().trim().isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { username, email } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const oldUsername = user.username;
      let usernameChanged = false;

      // Check if new username or email is already taken
      if (username && username !== user.username) {
        const userExists = await User.findOne({ username });
        if (userExists) {
          return res.status(400).json({ message: 'Username already taken' });
        }
        user.username = username;
        usernameChanged = true;
      }

      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already registered' });
        }
        user.email = email;
      }

      await user.save();

      // If username changed, update all posts and comments by this user
      if (usernameChanged) {
        // Update username in all posts
        await Post.updateMany(
          { user: user._id },
          { $set: { username: username } }
        );

        // Update username in all comments
        await Post.updateMany(
          { 'comments.user': user._id },
          { $set: { 'comments.$[elem].username': username } },
          { arrayFilters: [{ 'elem.user': user._id }] }
        );

        // Emit socket event for real-time username change
        const io = req.app.get('io');
        io.emit('usernameChanged', {
          userId: user._id.toString(),
          oldUsername,
          newUsername: username
        });
      }

      // Return user without password
      const updatedUser = await User.findById(user._id).select('-password');
      res.json(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Server error while updating profile' });
    }
  }
);

module.exports = router;
