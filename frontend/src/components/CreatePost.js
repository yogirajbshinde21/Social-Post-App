import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  IconButton,
  Avatar,
  Typography,
  Alert,
} from '@mui/material';
import { Photo, Close } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text && !image) {
      setError('Please provide either text or an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (image) formData.append('image', image);

      const response = await postsAPI.createPost(formData);
      
      // Add user info to the post
      const newPost = {
        ...response.data,
        user: { _id: user._id, username: user.username },
      };
      
      onPostCreated(newPost);
      
      // Reset form
      setText('');
      setImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        bgcolor: 'white',
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Create Post
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          
          <TextField
            fullWidth
            multiline
            rows={2}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#F5F5F5',
              },
            }}
          />
        </Box>

        {imagePreview && (
          <Box sx={{ position: 'relative', mb: 2 }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 8,
              }}
            />
            <IconButton
              size="small"
              onClick={handleRemoveImage}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(0,0,0,0.6)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.8)',
                },
              }}
            >
              <Close />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button
              component="span"
              startIcon={<Photo />}
              sx={{ color: 'primary.main' }}
            >
              Photo
            </Button>
          </label>

          <Button
            type="submit"
            variant="contained"
            disabled={loading || (!text && !image)}
            sx={{ borderRadius: 20, px: 3 }}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreatePost;
