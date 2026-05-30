@echo off
REM Deployment script for Signal-AI Project

echo ======================================
echo Signal-AI Deployment Script
echo ======================================
echo.

REM Check git status
echo 📋 Checking git status...
git status

echo.
echo 📝 Step 1: Push code to GitHub
echo Run: git add .
echo Run: git commit -m "Prepare for deployment"
echo Run: git push origin main
echo.

echo 📝 Step 2: Deploy Backend on Render
echo 1. Go to https://render.com/dashboard
echo 2. Click 'New +' ^> 'Web Service'
echo 3. Connect GitHub repository
echo 4. Configure:
echo    - Name: ai-stock-backend
echo    - Environment: Python 3
echo    - Region: Oregon
echo    - Build Command: cd signal-ai/backend ^&^& pip install -r requirements.txt
echo    - Start Command: cd signal-ai/backend ^&^& gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
echo 5. Add Environment Variables:
echo    - DEBUG: False
echo    - OPENROUTER_API_KEY: (your key)
echo    - MONGODB_URL: (your connection string)
echo.

echo 📝 Step 3: Deploy Frontend on Vercel
echo 1. Go to https://vercel.com/dashboard
echo 2. Click 'Add New' ^> 'Project'
echo 3. Import GitHub repository
echo 4. Configure:
echo    - Framework: Vite
echo    - Root Directory: signal-ai/frontend
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo 5. Add Environment Variables:
echo    - VITE_API_BASE_URL: https://your-render-backend-url.onrender.com
echo.

echo ✅ Deployment guide ready!
echo See DEPLOYMENT.md for detailed instructions
pause
