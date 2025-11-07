# 🚀 Quick Start Guide

Get your Social Post Application up and running in minutes!

## ⚡ Fast Setup (5 minutes)

### 1️⃣ Install Backend Dependencies

Open PowerShell and run:

```powershell
cd "d:\Yogiraj Internship Assignments\3W Assignment\backend"
npm install
```

### 2️⃣ Setup Backend Environment

Create a `.env` file in the backend folder:

```powershell
Copy-Item .env.example .env
```

Edit the `.env` file and update with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-post-app
JWT_SECRET=mySecretKey123!@#
NODE_ENV=development
```

**Note**: If you don't have MongoDB installed locally, use MongoDB Atlas (free):
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` value

### 3️⃣ Start Backend Server

```powershell
cd "d:\Yogiraj Internship Assignments\3W Assignment\backend"
npm run dev
```

You should see:
```
Server is running on port 5000
MongoDB Connected: ...
```

### 4️⃣ Install Frontend Dependencies

Open a NEW PowerShell window and run:

```powershell
cd "d:\Yogiraj Internship Assignments\3W Assignment\frontend"
npm install
```

### 5️⃣ Setup Frontend Environment

Create a `.env` file in the frontend folder:

```powershell
Copy-Item .env.example .env
```

The default value should work:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6️⃣ Start Frontend App

```powershell
cd "d:\Yogiraj Internship Assignments\3W Assignment\frontend"
npm start
```

Your browser will automatically open to http://localhost:3000

## ✅ Test Your Application

1. **Sign Up**: Create a new account
   - Username: testuser
   - Email: test@example.com
   - Password: test123

2. **Login**: Login with your credentials

3. **Create Post**: 
   - Click in the text area
   - Type something like "Hello World! This is my first post 🎉"
   - Click "Post"

4. **Add Image**: 
   - Click "Photo" button
   - Select an image
   - Add text (optional)
   - Click "Post"

5. **Like Post**: Click the heart icon

6. **Comment**: Click the comment icon, type a comment, and send

7. **View Comments**: Click comment icon to expand/collapse

## 🔧 Troubleshooting

### Problem: "Cannot connect to MongoDB"

**Solution 1 - Use MongoDB Atlas (Recommended)**:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster (M0)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Update `MONGODB_URI` in backend/.env

**Solution 2 - Install MongoDB locally**:
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB will run on `mongodb://localhost:27017`

### Problem: "Port 5000 already in use"

Change the port in backend/.env:
```env
PORT=5001
```

And update frontend/.env:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Problem: "npm: command not found"

Install Node.js:
1. Go to https://nodejs.org/
2. Download LTS version
3. Install with default settings
4. Restart PowerShell

### Problem: Frontend shows "Network Error"

1. Make sure backend is running on http://localhost:5000
2. Check `REACT_APP_API_URL` in frontend/.env
3. Restart frontend server after changing .env

## 📁 Project Structure

```
3W Assignment/
├── backend/           # Node.js + Express API
│   ├── server.js     # Start here to understand backend
│   ├── routes/       # API endpoints
│   └── models/       # Database schemas
│
└── frontend/         # React.js Application
    ├── src/
    │   ├── App.js    # Start here to understand frontend
    │   ├── pages/    # Login, Signup, Social pages
    │   └── components/ # Reusable components
    └── public/
```

## 🎯 Next Steps

1. ✅ Application running locally
2. 📝 Read the main README.md for detailed documentation
3. 🚀 Follow DEPLOYMENT.md to deploy your application
4. 📤 Submit your assignment before the deadline

## 💡 Tips

- Keep both terminals (backend & frontend) running
- Use Chrome DevTools (F12) to debug frontend issues
- Check backend terminal for API errors
- Test on mobile view (F12 → Toggle device toolbar)

## 📞 Need Help?

1. Check the error messages carefully
2. Read the detailed README.md in backend/ and frontend/
3. Review the DEPLOYMENT.md for deployment issues
4. Make sure all dependencies are installed

## 🎉 You're All Set!

Your Social Post Application is now running locally. Enjoy building! 🚀

---

**Backend**: http://localhost:5000
**Frontend**: http://localhost:3000
**MongoDB**: mongodb://localhost:27017/social-post-app
