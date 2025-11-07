# Mini Social Post Application

A full-stack social media application where users can create accounts, post content (text/images), view posts from others, like, and comment - inspired by the TaskPlanet app's Social Page.

## 🌟 Features

### User Authentication
- ✅ Sign up with username, email, and password
- ✅ Login with email and password
- ✅ JWT token-based authentication
- ✅ Secure password hashing with bcrypt

### Post Management
- ✅ Create posts with text, image, or both
- ✅ View all posts in a public feed
- ✅ Display username, post content, likes, and comments
- ✅ Delete own posts

### Interactions
- ✅ Like/unlike posts
- ✅ Comment on posts
- ✅ View all likes and comments
- ✅ Store usernames of people who liked/commented
- ✅ Real-time UI updates

### UI/UX
- ✅ Clean and modern design inspired by TaskPlanet
- ✅ Responsive layout for all devices
- ✅ Material-UI components
- ✅ Smooth animations and transitions
- ✅ Pagination support

## 🛠️ Tech Stack

### Frontend
- **React.js** - Frontend framework
- **Material-UI (MUI)** - UI component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## 📁 Project Structure

```
3W Assignment/
├── backend/                 # Backend server
│   ├── config/             # Configuration files
│   │   └── db.js          # Database connection
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js        # Authentication middleware
│   │   └── upload.js      # File upload configuration
│   ├── models/            # Database models
│   │   ├── User.js        # User model
│   │   └── Post.js        # Post model
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication routes
│   │   └── posts.js       # Post routes
│   ├── uploads/           # Uploaded images
│   ├── .env.example       # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   ├── server.js          # Main server file
│   └── README.md
│
└── frontend/               # Frontend application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/     # React components
    │   │   ├── CreatePost.js
    │   │   ├── PostCard.js
    │   │   └── PrivateRoute.js
    │   ├── context/        # Context providers
    │   │   └── AuthContext.js
    │   ├── pages/          # Page components
    │   │   ├── Login.js
    │   │   ├── Signup.js
    │   │   └── Social.js
    │   ├── services/       # API services
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    ├── .gitignore
    ├── package.json
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-post-app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

Application will open at http://localhost:3000

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (requires auth)
- `DELETE /api/posts/:id` - Delete post (requires auth)
- `POST /api/posts/:id/like` - Like/unlike post (requires auth)
- `POST /api/posts/:id/comment` - Comment on post (requires auth)

## 🗄️ Database Schema

### User Collection
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  profilePicture: String,
  createdAt: Date
}
```

### Post Collection
```javascript
{
  user: ObjectId (ref: User),
  username: String,
  text: String,
  image: String,
  likes: [ObjectId] (ref: User),
  likesUsernames: [String],
  comments: [{
    user: ObjectId (ref: User),
    username: String,
    text: String,
    createdAt: Date
  }],
  createdAt: Date
}
```

## 🌐 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `backend`
4. Add environment variables:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Secret key for JWT
   - `NODE_ENV` - production

### Frontend Deployment (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Create React App
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`
4. Add environment variable:
   - `REACT_APP_API_URL` - Your backend URL from Render

### Frontend Deployment (Netlify)

1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub repository
3. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: `frontend`
4. Add environment variable:
   - `REACT_APP_API_URL` - Your backend URL

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (or allow from anywhere: 0.0.0.0/0)
5. Get connection string and update `MONGODB_URI`

## ✨ Key Features Implementation

### Real-time Updates
- Likes and comments update instantly in the UI
- Optimistic updates for better user experience

### Security
- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- Protected API routes with middleware
- Input validation with express-validator

### File Upload
- Image upload with Multer
- File size limit (5MB)
- File type validation (JPEG, JPG, PNG, GIF)
- Secure file storage

### Pagination
- Load more functionality
- 20 posts per page
- Efficient database queries

## 🎨 UI Design Inspiration

The UI is inspired by the TaskPlanet app's Social Page with:
- Clean white cards for posts
- Blue primary color scheme (#3366FF)
- Gold accents for points/rewards
- Bottom navigation bar
- Responsive design
- Modern Material-UI components

## 📝 Assignment Requirements Checklist

✅ **Account Creation**
- Simple signup and login with email and password
- User details stored in MongoDB

✅ **Create Post**
- Users can post text, image, or both
- Neither field is mandatory (at least one required)

✅ **Feed**
- All posts from all users visible in public feed
- Display username, post content, likes, and comments count

✅ **Like and Comment**
- Users can like or comment on any post
- Show total likes and comments
- Save usernames of people who liked or commented

✅ **Tech Stack**
- Frontend: React.js ✓
- Backend: Node.js + Express ✓
- Database: MongoDB ✓
- Styling: Material UI ✓
- No TailwindCSS ✓

✅ **Guidelines**
- Clean UI inspired by TaskPlanet ✓
- Two MongoDB collections (users and posts) ✓
- Basic authentication flow ✓
- Like and comment updates reflect instantly ✓

## 🏆 Bonus Features Implemented

✅ Clean and modern UI
✅ Responsive and optimized layout
✅ Efficient pagination logic
✅ Well-structured and reusable code
✅ Code comments and best practices
✅ Separate folders for frontend and backend
✅ Comprehensive README files
✅ Environment variable examples
✅ Error handling
✅ Input validation

## 📄 License

ISC

## 👤 Author

Yogiraj - Internship Assignment for 3W

## 📞 Support

For any queries regarding this project, please refer to the documentation in the respective README files in the frontend and backend directories.

---

**Note**: Make sure to update the `.env` files with your own values before running the application. Never commit `.env` files to version control.
