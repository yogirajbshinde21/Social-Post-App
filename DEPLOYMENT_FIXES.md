# 🚨 Deployment Issues - Quick Fix Guide

## Issues Fixed in Latest Commit

### 1. ✅ CORS Policy Errors
**Problem**: Frontend blocked by CORS policy
```
Access to XMLHttpRequest blocked by CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution Applied**: 
- Updated `backend/server.js` to include Vercel frontend URL in CORS configuration
- Added proper CORS methods: GET, POST, PUT, DELETE, OPTIONS
- Enabled credentials support

### 2. ✅ 404 Not Found Errors
**Problem**: API endpoints returning 404
```
POST https://social-post-backend-hs3e.onrender.com/auth/signup - 404 (Not Found)
```

**Solution Applied**:
- Created `.env.production` file with correct backend URL
- Ensured API routes are properly configured with `/api` prefix
- Added health check endpoint at `/api/health`

### 3. ✅ Socket.io Connection Issues
**Solution Applied**:
- Updated Socket.io CORS to allow Vercel frontend
- Socket.io will auto-connect when backend is properly configured

## 🔄 Steps to Apply Fixes

The fixes have been pushed to GitHub. Now you need to redeploy:

### Step 1: Redeploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Find your `social-post-backend` service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait 5-10 minutes for deployment
5. Check logs to ensure no errors

**Verify Backend**:
- Visit: `https://social-post-backend-hs3e.onrender.com/api/health`
- Should show: `{"status":"OK","message":"Server is running"}`

### Step 2: Redeploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your `social-post-app` project
3. Go to "Settings" → "Environment Variables"
4. Add/Update variable:
   - **Name**: `REACT_APP_API_URL`
   - **Value**: `https://social-post-backend-hs3e.onrender.com/api`
   - **Environment**: All (Production, Preview, Development)
5. Click "Save"
6. Go to "Deployments" tab
7. Click the three dots on the latest deployment → "Redeploy"
8. Wait 2-5 minutes

**Verify Frontend**:
- Visit: `https://social-post-app-delta.vercel.app/`
- Open browser console (F12) - should see no CORS errors
- Try to sign up - should work now

## 🧪 Testing After Redeployment

1. **Test Signup**:
   - Go to frontend URL
   - Click "Sign Up"
   - Enter details: username, email, password
   - Should successfully create account

2. **Test Login**:
   - Use the account you just created
   - Should redirect to social feed

3. **Test Post Creation**:
   - Create a new post
   - Should appear in feed immediately
   - Open in another browser/tab - should see the post

4. **Test Real-time Features**:
   - Open in 2 browser windows with different accounts
   - Like/comment in one window
   - Should update instantly in the other

## 📋 Checklist

After redeployment, verify:

- [ ] Backend health check responds: `/api/health`
- [ ] Frontend loads without CORS errors
- [ ] Signup works
- [ ] Login works
- [ ] Create post works
- [ ] Like/unlike works
- [ ] Comments work
- [ ] Real-time updates work
- [ ] Profile edit works
- [ ] Notifications work

## 🔍 Still Having Issues?

### Check Backend Logs on Render

1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors (usually red text)

Common errors:
- **MongoDB connection failed**: Check MONGODB_URI environment variable
- **Cannot find module**: Run "Clear build cache" and redeploy
- **Port already in use**: This shouldn't happen on Render

### Check Frontend Console

1. Open your deployed frontend
2. Press F12 (or right-click → Inspect)
3. Go to "Console" tab
4. Look for red errors

Common errors:
- **CORS error**: Backend needs redeployment with latest code
- **404 error**: Check REACT_APP_API_URL environment variable
- **Network error**: Backend might be sleeping (free tier), wait 60 seconds and retry

### Force Backend Wake-Up

If backend is sleeping (free tier on Render):
1. Visit: `https://social-post-backend-hs3e.onrender.com/api/health`
2. Wait 30-60 seconds for backend to start
3. Refresh frontend page
4. Try signup/login again

## 🎯 What Changed in the Code

### `backend/server.js`
```javascript
// Before
app.use(cors());

// After
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://social-post-app-delta.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
```

### `frontend/.env.production` (NEW FILE)
```
REACT_APP_API_URL=https://social-post-backend-hs3e.onrender.com/api
```

### `.gitignore`
```diff
- .env.production.local
+ # Note: .env.production is NOT ignored for deployment
```

## 💡 Important Notes

1. **Render Free Tier**: Backend sleeps after 15 minutes of inactivity. First request takes 30-60 seconds to wake up.

2. **Environment Variables**: After changing environment variables on Vercel, you MUST redeploy.

3. **CORS**: Both frontend and backend must have matching URLs configured.

4. **API URL**: Must end with `/api` but NO trailing slash: ✅ `/api` ❌ `/api/`

5. **MongoDB**: Make sure IP whitelist has `0.0.0.0/0` to allow Render servers.

## ✨ Expected Behavior After Fixes

1. ✅ No CORS errors in browser console
2. ✅ Signup creates new user successfully
3. ✅ Login redirects to social feed
4. ✅ Posts load and display
5. ✅ Real-time updates work across multiple tabs/browsers
6. ✅ Socket.io connects (check console: "Socket connected")

## 🆘 Need More Help?

If issues persist after following all steps:

1. Check both Render and Vercel logs
2. Clear browser cache completely
3. Try in incognito/private mode
4. Wait 2-3 minutes between deployments
5. Ensure MongoDB Atlas is accessible (not IP restricted)

## 📱 Contact Information

If you need additional support, provide:
- [ ] Screenshot of browser console errors
- [ ] Screenshot of Render backend logs
- [ ] Screenshot of Vercel deployment logs
- [ ] Environment variables (redact sensitive info)

---

**Last Updated**: November 7, 2025
**Status**: All fixes committed and pushed to GitHub
**Next Step**: Redeploy backend on Render, then redeploy frontend on Vercel
