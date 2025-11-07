# Social Post Application - Frontend

Frontend for the Mini Social Post Application built with React.js and Material-UI.

## Features

- User authentication (Login/Signup)
- Create posts with text and/or images
- View feed of all posts
- Like/unlike posts with instant UI updates
- Comment on posts
- Delete own posts
- Responsive design inspired by TaskPlanet app
- Clean and modern UI with Material-UI

## Tech Stack

- **React.js** - Frontend library
- **Material-UI (MUI)** - UI component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Context API** - State management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── CreatePost.js      # Post creation form
│   │   ├── PostCard.js        # Individual post display
│   │   └── PrivateRoute.js    # Protected route wrapper
│   ├── context/
│   │   └── AuthContext.js     # Authentication context
│   ├── pages/
│   │   ├── Login.js           # Login page
│   │   ├── Signup.js          # Signup page
│   │   └── Social.js          # Main social feed page
│   ├── services/
│   │   └── api.js             # API service layer
│   ├── App.js                 # Main app component
│   ├── index.js               # Entry point
│   └── index.css              # Global styles
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

## Features Breakdown

### Authentication
- Sign up with username, email, and password
- Login with email and password
- JWT token-based authentication
- Automatic token persistence in localStorage
- Protected routes with redirect to login

### Social Feed
- View all posts in chronological order (newest first)
- Toggle between "All Posts" and "My Posts"
- Pagination with "Load More" functionality
- Real-time updates for likes and comments

### Post Creation
- Create posts with text only
- Create posts with image only
- Create posts with both text and image
- Image preview before posting
- 5MB file size limit validation
- Supported formats: JPEG, JPG, PNG, GIF

### Post Interactions
- Like/unlike posts with instant visual feedback
- Add comments to posts
- View all comments on a post
- Delete own posts
- Display like count and comment count
- Show usernames of people who liked

### UI/UX Features
- Clean and modern design inspired by TaskPlanet
- Responsive layout for all screen sizes
- Bottom navigation bar (TaskPlanet style)
- Top app bar with points and balance display
- Avatar placeholders for users
- Relative timestamps (e.g., "2h ago", "3d ago")
- Smooth animations and transitions
- Error handling with user-friendly messages

## Deployment on Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com)

3. Import your repository

4. Configure:
   - Framework Preset: Create React App
   - Root Directory: frontend
   - Build Command: `npm run build`
   - Output Directory: `build`

5. Add environment variable:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., https://your-backend.onrender.com/api)

6. Deploy

## Deployment on Netlify

1. Build the project:
```bash
npm run build
```

2. Go to [Netlify](https://netlify.com)

3. Drag and drop the `build` folder

OR

1. Connect your GitHub repository

2. Configure:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Base directory: `frontend`

3. Add environment variable:
   - `REACT_APP_API_URL`: Your backend API URL

4. Deploy

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API base URL | http://localhost:5000/api |

## Color Palette (TaskPlanet Inspired)

- Primary Blue: `#3366FF`
- Secondary Gold: `#FFD700`
- Success Green: `#4CAF50`
- Error Red: `#FF3B30`
- Background: `#F5F5F5`
- Paper: `#FFFFFF`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
