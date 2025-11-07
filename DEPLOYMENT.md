# 3W Assignment - Deployment Guide

## 🚀 Deployment Instructions

This guide will help you deploy your Social Post Application to production.

## Prerequisites

1. GitHub account
2. MongoDB Atlas account (free tier)
3. Render account (for backend)
4. Vercel or Netlify account (for frontend)

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new account or login
3. Create a new cluster (M0 Sandbox - FREE)
4. Wait for cluster to be created (2-3 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `myFirstDatabase` with your database name (e.g., `social-post-app`)

Example connection string:
```
mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/social-post-app?retryWrites=true&w=majority
```

## Step 2: Push Code to GitHub

1. Initialize git in your project root:
```bash
cd "d:\Yogiraj Internship Assignments\3W Assignment"
git init
git add .
git commit -m "Initial commit - Social Post Application"
```

2. Create a new repository on GitHub (without README, .gitignore, or license)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy Backend on Render

1. Go to [Render](https://render.com) and sign up/login

2. Click "New +" → "Web Service"

3. Connect your GitHub repository

4. Configure the service:
   - **Name**: social-post-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A random secure string (e.g., use https://randomkeygen.com/)
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (Render will override this)

6. Click "Create Web Service"

7. Wait for deployment (5-10 minutes)

8. Copy your backend URL (e.g., `https://social-post-backend.onrender.com`)

**Note**: Free tier on Render may spin down after inactivity. First request might take 30-60 seconds.

## Step 4: Deploy Frontend on Vercel

### Option A: Using Vercel (Recommended)

1. Go to [Vercel](https://vercel.com) and sign up/login

2. Click "Add New..." → "Project"

3. Import your GitHub repository

4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

5. Add Environment Variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - (Use your Render backend URL from Step 3)

6. Click "Deploy"

7. Wait for deployment (2-5 minutes)

8. Your app will be live at `https://your-app.vercel.app`

### Option B: Using Netlify

1. Go to [Netlify](https://netlify.com) and sign up/login

2. Click "Add new site" → "Import an existing project"

3. Connect your GitHub repository

4. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

5. Click "Show advanced" → "New variable"
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`

6. Click "Deploy site"

7. Wait for deployment (2-5 minutes)

8. Your app will be live at `https://your-app.netlify.app`

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Create a new account (Sign up)
3. Login with your credentials
4. Create a test post
5. Like and comment on the post
6. Verify everything works

## Step 6: Submit Your Assignment

Fill out the submission form with:

1. **GitHub Repository URL**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
2. **Frontend URL**: Your Vercel or Netlify URL
3. **Backend URL**: Your Render URL

## 🔧 Troubleshooting

### Backend Issues

**Problem**: "Cannot connect to MongoDB"
- **Solution**: Check MongoDB Atlas IP whitelist. Add `0.0.0.0/0` to allow all IPs

**Problem**: "Internal Server Error"
- **Solution**: Check Render logs. Go to your service → "Logs" tab

### Frontend Issues

**Problem**: "Network Error" or "Failed to fetch"
- **Solution**: Verify `REACT_APP_API_URL` is set correctly with `/api` at the end
- **Solution**: Check CORS settings in backend

**Problem**: Images not loading
- **Solution**: This is expected on Render free tier (no persistent storage)
- **Solution**: For production, use cloud storage like AWS S3 or Cloudinary

## 📱 Testing Checklist

Before submission, verify:

- [ ] Sign up works
- [ ] Login works
- [ ] Can create post with text only
- [ ] Can create post with image only
- [ ] Can create post with both
- [ ] Can view all posts
- [ ] Can like posts
- [ ] Can unlike posts
- [ ] Can add comments
- [ ] Can delete own posts
- [ ] Responsive on mobile
- [ ] All features work on deployed version

## 🎯 Bonus Points Checklist

- [ ] Clean and modern UI ✓
- [ ] Responsive layout ✓
- [ ] Pagination logic ✓
- [ ] Well-structured code ✓
- [ ] Code comments ✓
- [ ] Separate frontend/backend folders ✓
- [ ] Public GitHub repository ✓
- [ ] Deployed and working ✓

## 📞 Support

If you encounter issues during deployment:

1. Check the logs on Render/Vercel/Netlify
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas is accessible
4. Check that your GitHub repository is public

## 🎉 Success!

Once everything is deployed and tested:

1. Take screenshots of your working application
2. Document any additional features you added
3. Submit the form before the deadline (11 Nov 2025)

Good luck with your submission! 🚀
