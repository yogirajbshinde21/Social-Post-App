const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/cloudinaryUpload'); // Changed to Cloudinary upload
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    // Cloudinary returns the full URL in req.file.path
    const image = req.file ? req.file.path : null;

    // Validate that at least text or image is provided
    if (!text && !image) {
      return res.status(400).json({ message: 'Please provide either text or an image' });
    }

    const post = await Post.create({
      user: req.user._id,
      username: req.user.username,
      text: text || '',
      image: image
    });

    // Populate user data before sending
    await post.populate('user', 'username profilePicture');

    // Emit socket event for real-time post creation
    const io = req.app.get('io');
    io.emit('postCreated', post);

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error while creating post' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error while fetching posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Server error while fetching post' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/Unlike a post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('user', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if post is already liked by user
    const likeIndex = post.likes.indexOf(req.user._id);
    let isLiked = false;

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
      post.likesUsernames.splice(post.likesUsernames.indexOf(req.user.username), 1);
      
      // Remove notification
      await Notification.deleteOne({
        recipient: post.user._id,
        sender: req.user._id,
        post: post._id,
        type: 'like'
      });
    } else {
      // Like the post
      post.likes.push(req.user._id);
      post.likesUsernames.push(req.user.username);
      isLiked = true;
      
      // Create notification (only if not liking own post)
      if (post.user._id.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.user._id,
          sender: req.user._id,
          senderUsername: req.user.username,
          type: 'like',
          post: post._id,
          postText: post.text ? post.text.substring(0, 50) : '[Image]'
        });
        
        // Emit socket event for real-time notification
        const io = req.app.get('io');
        io.emit('newNotification', {
          userId: post.user._id.toString(),
          type: 'like'
        });
      }
    }

    await post.save();

    // Emit socket event for real-time like update
    const io = req.app.get('io');
    io.emit('postLiked', {
      postId: post._id,
      likes: post.likes,
      likesCount: post.likes.length,
      likesUsernames: post.likesUsernames,
      isLiked
    });

    res.json({
      likes: post.likes,
      likesCount: post.likes.length,
      likesUsernames: post.likesUsernames
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error while liking post' });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Add a comment to a post
// @access  Private
router.post(
  '/:id/comment',
  protect,
  [
    body('text').trim().notEmpty().withMessage('Comment text is required')
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { text } = req.body;
      const post = await Post.findById(req.params.id).populate('user', 'username');

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newComment = {
        user: req.user._id,
        username: req.user.username,
        text
      };

      post.comments.push(newComment);
      await post.save();

      // Create notification (only if not commenting on own post)
      if (post.user._id.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.user._id,
          sender: req.user._id,
          senderUsername: req.user.username,
          type: 'comment',
          post: post._id,
          postText: post.text ? post.text.substring(0, 50) : '[Image]',
          commentText: text.substring(0, 100)
        });
        
        // Emit socket event for real-time notification
        const io = req.app.get('io');
        io.emit('newNotification', {
          userId: post.user._id.toString(),
          type: 'comment'
        });
      }

      // Populate the comment user info
      await post.populate('comments.user', 'username profilePicture');

      // Emit socket event for real-time comment update
      const io = req.app.get('io');
      io.emit('postCommented', {
        postId: post._id,
        comments: post.comments,
        commentsCount: post.comments.length
      });

      res.status(201).json({
        comments: post.comments,
        commentsCount: post.comments.length
      });
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(500).json({ message: 'Server error while adding comment' });
    }
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    const postId = post._id;
    await post.deleteOne();

    // Emit socket event for real-time post deletion
    const io = req.app.get('io');
    io.emit('postDeleted', { postId: postId.toString() });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error while deleting post' });
  }
});

module.exports = router;
