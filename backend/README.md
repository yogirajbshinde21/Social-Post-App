# Social Post Application - Backend

Backend API for the Mini Social Post Application built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup/login) with JWT
- Create posts with text and/or images
- View all posts in a feed
- Like/unlike posts
- Comment on posts
- Secure password hashing with bcrypt
- File upload support for images

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## API Endpoints

### Authentication

#### Signup
```
POST /api/auth/signup
Body: {
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "string",
  "password": "string"
}
```

### Posts

#### Create Post
```
POST /api/posts
Headers: { "Authorization": "Bearer <token>" }
Body (form-data): {
  "text": "string" (optional if image provided),
  "image": file (optional if text provided)
}
```

#### Get All Posts (Feed)
```
GET /api/posts?page=1&limit=20
```

#### Get Single Post
```
GET /api/posts/:id
```

#### Like/Unlike Post
```
POST /api/posts/:id/like
Headers: { "Authorization": "Bearer <token>" }
```

#### Add Comment
```
POST /api/posts/:id/comment
Headers: { "Authorization": "Bearer <token>" }
Body: {
  "text": "string"
}
```

#### Delete Post
```
DELETE /api/posts/:id
Headers: { "Authorization": "Bearer <token>" }
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-post-app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

3. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## MongoDB Setup

### Local MongoDB
Make sure MongoDB is installed and running on your machine.

### MongoDB Atlas (Recommended for Deployment)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and replace `MONGODB_URI` in `.env`

## Deployment on Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── upload.js          # File upload configuration
├── models/
│   ├── User.js            # User model
│   └── Post.js            # Post model
├── routes/
│   ├── auth.js            # Authentication routes
│   └── posts.js           # Post routes
├── uploads/               # Uploaded images directory
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
└── server.js              # Main server file
```

## Database Models

### User Model
- username (unique)
- email (unique)
- password (hashed)
- profilePicture
- createdAt

### Post Model
- user (reference to User)
- username
- text
- image
- likes (array of user IDs)
- likesUsernames (array of usernames)
- comments (array of comment objects)
- createdAt

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected routes with middleware
- Input validation with express-validator
- File type and size validation for uploads

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## License

ISC
