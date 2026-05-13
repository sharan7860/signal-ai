#!/bin/bash
# Quick setup script for macOS/Linux

echo "Creating Python virtual environment..."
python3 -m venv venv

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Setup complete! To start the backend, run:"
echo "  source venv/bin/activate"
echo "  uvicorn app.main:app --reload"
echo ""
echo "API Documentation will be available at:"
echo "  http://localhost:8000/docs"
echo ""
