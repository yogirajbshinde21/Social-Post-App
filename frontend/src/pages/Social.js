import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Logout,
  Notifications,
  AccountCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { postsAPI, notificationsAPI } from '../services/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Social = () => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts(pageNum, 20);
      
      if (pageNum === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }
      
      setHasMore(response.data.currentPage < response.data.totalPages);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Socket.io real-time listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new post created events
    socket.on('postCreated', (newPost) => {
      setPosts(prevPosts => {
        // Check if post already exists to prevent duplicates
        const postExists = prevPosts.some(post => post._id === newPost._id);
        if (postExists) {
          return prevPosts;
        }
        return [newPost, ...prevPosts];
      });
    });

    // Listen for post deleted events
    socket.on('postDeleted', (data) => {
      setPosts(prevPosts => prevPosts.filter(post => post._id !== data.postId));
    });

    // Listen for post liked events
    socket.on('postLiked', (data) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === data.postId 
            ? { 
                ...post, 
                likes: data.likes,
                likesCount: data.likesCount,
                likesUsernames: data.likesUsernames,
                isLiked: data.isLiked 
              }
            : post
        )
      );
    });

    // Listen for post commented events
    socket.on('postCommented', (data) => {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === data.postId 
            ? { 
                ...post, 
                comments: data.comments,
                commentsCount: data.commentsCount 
              }
            : post
        )
      );
    });

    // Listen for username changed events
    socket.on('usernameChanged', (data) => {
      setPosts(prevPosts => 
        prevPosts.map(post => {
          // Update post username if it's from the user who changed their name
          const updatedPost = { ...post };
          if (post.user._id === data.userId) {
            updatedPost.username = data.newUsername;
            if (updatedPost.user) {
              updatedPost.user.username = data.newUsername;
            }
          }
          
          // Update comment usernames
          if (post.comments && post.comments.length > 0) {
            updatedPost.comments = post.comments.map(comment => {
              if (comment.user._id === data.userId) {
                return {
                  ...comment,
                  username: data.newUsername,
                  user: {
                    ...comment.user,
                    username: data.newUsername
                  }
                };
              }
              return comment;
            });
          }
          
          return updatedPost;
        })
      );
    });

    // Listen for new notification events
    socket.on('newNotification', (data) => {
      // Fetch updated unread count
      fetchUnreadCount();
    });

    return () => {
      socket.off('postCreated');
      socket.off('postDeleted');
      socket.off('postLiked');
      socket.off('postCommented');
      socket.off('usernameChanged');
      socket.off('newNotification');
    };
  }, [socket]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 2 }}>
      {/* Header - Inspired by TaskPlanet */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 'bold' }}>
            Social
          </Typography>

          {/* Notifications */}
          <IconButton 
            color="default" 
            onClick={() => navigate('/notifications')}
            title="Notifications"
          >
            <Badge badgeContent={unreadCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton 
            color="primary" 
            sx={{ ml: 1 }}
            onClick={() => navigate('/profile')}
            title="Profile"
          >
            <AccountCircle />
          </IconButton>

          {/* Logout */}
          <IconButton onClick={handleLogout} color="error" title="Logout" sx={{ ml: 1 }}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Tabs - All Posts / My Posts */}
        <Box sx={{ bgcolor: 'white', borderRadius: 2, mb: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.9rem',
              },
            }}
          >
            <Tab label="All Posts" />
            <Tab label="My Posts" />
          </Tabs>
        </Box>

        {/* Create Post Section */}
        {tabValue === 0 && <CreatePost onPostCreated={handlePostCreated} />}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Posts Feed */}
        {loading && posts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {posts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'white', borderRadius: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  No posts yet. Be the first to share something!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {posts
                  .filter(post => tabValue === 0 || post.user._id === user._id)
                  .map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      currentUser={user}
                      onUpdate={handlePostUpdate}
                      onDelete={handlePostDelete}
                    />
                  ))}
              </Box>
            )}

            {/* Load More Button */}
            {hasMore && posts.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Social;
