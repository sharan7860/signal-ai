@echo off
REM Quick setup script for Windows

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Setup complete! To start the backend, run:
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload
echo.
echo API Documentation will be available at:
echo   http://localhost:8000/docs
echo.
