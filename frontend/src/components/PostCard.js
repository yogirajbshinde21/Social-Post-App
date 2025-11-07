import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  TextField,
  Button,
  Collapse,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  MoreVert,
  Delete,
  Send,
} from '@mui/icons-material';
import { postsAPI } from '../services/api';

const PostCard = ({ post, currentUser, onUpdate, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const isLiked = post.likes?.includes(currentUser?._id);
  const isOwnPost = post.user?._id === currentUser?._id;

  const API_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const handleLike = async () => {
    try {
      const response = await postsAPI.likePost(post._id);
      onUpdate({
        ...post,
        likes: response.data.likes,
        likesUsernames: response.data.likesUsernames,
      });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const response = await postsAPI.commentPost(post._id, commentText);
      onUpdate({
        ...post,
        comments: response.data.comments,
      });
      setCommentText('');
    } catch (err) {
      console.error('Error commenting:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post._id);
        onDelete(post._id);
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.username?.charAt(0).toUpperCase()}
          </Avatar>
        }
        action={
          isOwnPost && (
            <>
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={handleDelete}>
                  <Delete fontSize="small" sx={{ mr: 1 }} />
                  Delete
                </MenuItem>
              </Menu>
            </>
          )
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold">
            {post.username}
          </Typography>
        }
        subheader={
          <Typography variant="caption" color="text.secondary">
            {formatDate(post.createdAt)}
          </Typography>
        }
      />

      {post.text && (
        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.text}
          </Typography>
        </CardContent>
      )}

      {post.image && (
        <Box
          component="img"
          src={`${API_BASE_URL}${post.image}`}
          alt="Post"
          sx={{
            width: '100%',
            maxHeight: 500,
            objectFit: 'cover',
          }}
        />
      )}

      <CardActions sx={{ px: 2, py: 1 }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
              {isLiked ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
            <Typography variant="body2">{post.likes?.length || 0}</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => setShowComments(!showComments)}>
              <ChatBubbleOutline />
            </IconButton>
            <Typography variant="body2">{post.comments?.length || 0}</Typography>
          </Box>
        </Box>
      </CardActions>

      {/* Comments Section */}
      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Display Comments */}
          {post.comments && post.comments.length > 0 && (
            <Box sx={{ mb: 2, maxHeight: 300, overflowY: 'auto' }}>
              {post.comments.map((comment) => (
                <Box
                  key={comment._id}
                  sx={{
                    display: 'flex',
                    gap: 1,
                    mb: 2,
                    p: 1.5,
                    bgcolor: '#F5F5F5',
                    borderRadius: 2,
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {comment.username?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {comment.username}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {comment.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(comment.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Add Comment Form */}
          <form onSubmit={handleComment}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                {currentUser?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <TextField
                fullWidth
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
                size="small"
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#F5F5F5',
                  },
                }}
              />
              <IconButton
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                color="primary"
              >
                <Send />
              </IconButton>
            </Box>
          </form>
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;
