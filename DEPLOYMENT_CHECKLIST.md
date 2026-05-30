# Deployment Checklist

## Pre-Deployment
- [ ] All code committed to GitHub main branch
- [ ] Environment variables created (.env.production files)
- [ ] Render and Vercel accounts created
- [ ] GitHub repository connected to Render and Vercel
- [ ] Requirements.txt updated with all dependencies
- [ ] Backend Procfile configured correctly
- [ ] Frontend build command tested locally: `npm run build`
- [ ] API endpoints tested and working locally

## Backend (Render) Deployment
- [ ] Create new Web Service on Render
- [ ] Select Python 3.10 environment
- [ ] Configure environment variables:
  - [ ] DEBUG=False
  - [ ] OPENROUTER_API_KEY (set in Render dashboard)
  - [ ] MONGODB_URL (set in Render dashboard)
  - [ ] CORS_ORIGINS (update after frontend URL known)
- [ ] Build command: `cd signal-ai/backend && pip install -r requirements.txt`
- [ ] Start command: `cd signal-ai/backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
- [ ] Wait for build to complete and service to start
- [ ] Test API at: https://your-backend.onrender.com/health
- [ ] Copy backend URL for frontend configuration
- [ ] Update CORS_ORIGINS with frontend URL

## Frontend (Vercel) Deployment
- [ ] Create new project on Vercel
- [ ] Import GitHub repository
- [ ] Set root directory: signal-ai/frontend
- [ ] Configure environment variables:
  - [ ] VITE_API_BASE_URL=https://your-backend.onrender.com
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Deploy and wait for completion
- [ ] Test frontend at: https://your-project.vercel.app
- [ ] Verify API calls working from frontend

## Post-Deployment
- [ ] Test all API endpoints
- [ ] Verify analytics dashboard loading
- [ ] Check stock data fetching
- [ ] Test chat functionality
- [ ] Verify alerts system
- [ ] Monitor backend logs on Render for errors
- [ ] Monitor frontend performance on Vercel

## Troubleshooting
- [ ] Check Render logs if backend fails to start
- [ ] Check Vercel build logs if frontend fails to build
- [ ] Verify CORS settings match frontend URL
- [ ] Check environment variables are set correctly
- [ ] Test API connectivity from Vercel environment

## Final Steps
- [ ] Add production URL to README.md
- [ ] Update documentation with deployment steps
- [ ] Set up monitoring and error tracking
- [ ] Configure auto-redeploy on push (both platforms support this)
