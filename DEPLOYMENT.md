# Deployment Guide - Vercel & Render

## Prerequisites
- Vercel Account: https://vercel.com
- Render Account: https://render.com
- GitHub repository with your code

## Step 1: Deploy Backend to Render

### 1.1 Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Deploy on Render
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name:** ai-stock-backend
   - **Environment:** Python 3
   - **Build Command:** `pip install -r signal-ai/backend/requirements.txt`
   - **Start Command:** `gunicorn -w 4 -k uvicorn.workers.UvicornWorker signal-ai.backend.app.main:app`
   - **Root Directory:** signal-ai/backend (optional, leave empty if not needed)

### 1.3 Set Environment Variables (in Render Dashboard)
- `DEBUG`: False
- `OPENROUTER_API_KEY`: (your API key)
- `MONGODB_URL`: (your MongoDB connection string)
- `CORS_ORIGINS`: Update after frontend deployment

### 1.4 Get Backend URL
After deployment, you'll get a URL like: `https://ai-stock-backend.onrender.com`

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Configure Frontend API URL
1. Update `signal-ai/frontend/.env.production` with:
   ```
   VITE_API_BASE_URL=https://ai-stock-backend.onrender.com
   ```

### 2.2 Deploy on Vercel
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** signal-ai/frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.3 Set Environment Variables (in Vercel)
- `VITE_API_BASE_URL`: https://ai-stock-backend.onrender.com

### 2.4 Deploy
Click "Deploy" and wait for completion. You'll get a URL like: `https://your-project.vercel.app`

---

## Step 3: Update Backend CORS

1. Go back to Render Dashboard
2. Update `CORS_ORIGINS` environment variable:
   ```
   ["https://your-project.vercel.app"]
   ```
3. Redeploy backend

---

## Important Endpoints

- **Frontend:** https://your-project.vercel.app
- **Backend API:** https://ai-stock-backend.onrender.com
- **API Docs:** https://ai-stock-backend.onrender.com/docs

---

## Troubleshooting

### Backend won't start
- Check Python version requirements (3.10+)
- Verify all dependencies in requirements.txt
- Check Render logs for errors

### Frontend can't reach API
- Verify CORS_ORIGINS on backend matches frontend URL
- Check VITE_API_BASE_URL in Vercel environment
- Verify backend is running on Render

### Build failures
- Clear Render/Vercel cache
- Check for missing dependencies
- Verify environment variables are set correctly
