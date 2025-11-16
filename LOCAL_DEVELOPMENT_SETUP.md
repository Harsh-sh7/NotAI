# Local Development Setup Guide

## Configuration Changes Made

### 1. Frontend Configuration (`frontend/.env.local`)
```env
VITE_GEMINI_API_KEY=AIzaSyAYT5r4t8c0tHEfn28Inv-ZOQd8__Nlk7E

# Local Development Configuration
VITE_API_URL=http://localhost:5001
NODE_ENV=development
```

### 2. Backend Configuration (`backend/.env`)
```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=9544153309-ck6do0090li0ess10qune70jrvlu2rto.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
# Local Development URLs
FRONTEND_URL=http://localhost:3000
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

## Google OAuth Console Setup Required

⚠️ **IMPORTANT**: You need to update your Google OAuth console settings to allow localhost URLs.

### Steps to Update Google OAuth Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Find your OAuth 2.0 Client ID: `9544153309-ck6do0090li0ess10qune70jrvlu2rto.apps.googleusercontent.com`
4. Click on it to edit
5. Add these URLs to **Authorized redirect URIs**:
   - `http://localhost:5001/api/auth/google/callback`
6. Add these URLs to **Authorized JavaScript origins** (if needed):
   - `http://localhost:3000`
   - `http://localhost:5001`

## Running the Application Locally

### 1. Start Backend Server
```bash
cd backend
npm start
```
Server will run on: http://localhost:5001

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Frontend will run on: http://localhost:3000

## OAuth Flow for Local Development

1. User clicks "Continue with Google" button
2. Redirects to: `http://localhost:5001/api/auth/google`
3. Google OAuth redirects back to: `http://localhost:5001/api/auth/google/callback`
4. Backend processes authentication and redirects to: `http://localhost:3000/auth/callback?token=<jwt_token>&redirect=/`
5. Frontend handles the token and completes authentication

## Troubleshooting

### Common Issues:

1. **OAuth Error: redirect_uri_mismatch**
   - Make sure you've added `http://localhost:5001/api/auth/google/callback` to Google OAuth console

2. **CORS Errors**
   - Backend is configured to allow `http://localhost:3000` and `http://127.0.0.1:3000`

3. **Environment Variables Not Loading**
   - Restart both servers after changing `.env` files
   - Make sure `.env.local` exists in frontend directory
   - Make sure `.env` exists in backend directory

### Switching Back to Production:

To switch back to production, update:

**Frontend `.env.local`:**
```env
VITE_API_URL=https://notai-1.onrender.com
```

**Backend `.env`:**
```env
FRONTEND_URL=https://not-ai-pro.vercel.app
GOOGLE_CALLBACK_URL=https://notai-1.onrender.com/api/auth/google/callback
```
