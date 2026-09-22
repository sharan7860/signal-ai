# AI Stock Market Backend Setup

## Prerequisites

- Python 3.10+
- pip (Python package manager)
- Virtual environment tool (venv)

## Installation Steps

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 2. Activate Virtual Environment

**On Windows:**
```bash
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the tracked template and keep credentials in the ignored local file:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

`OPENROUTER_API_KEY` is optional. If it is unavailable, the chat endpoint provides a limited local reference for common technical-analysis questions. Never put this key in a frontend `VITE_*` variable.

## Running the Application

### Development Server (with auto-reload)

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once running, visit:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Available Endpoints

### Health Check
- `GET /` - Root health check
- `GET /health` - Health status
- `GET /ping` - Simple ping

### Market analysis
- `GET /stock/{symbol}` - Quote and price history
- `GET /api/stocks/quote/{symbol}` - Quote and price history
- `POST /api/stocks/data` - Stock data from a validated request body
- `GET /api/stocks/data/{symbol}` - Stock data and daily closes
- `POST /api/stocks/analyze` - Transparent technical or fundamental rules
- `GET /api/stocks/dashboard/{symbol}` - Quote, indicators, rules, and an illustrative projection
- `GET /api/stocks/compare/{symbols}` - Compare validated tickers

### Chat
- `POST /api/chat` - Educational market assistant using a server-side provider key when available

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config/
│   │   ├── __init__.py
│   │   └── settings.py         # Configuration management
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py          # Pydantic models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── stock_service.py    # Stock data operations
│   │   └── ai_service.py       # AI analysis operations
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── health.py           # Health check endpoints
│   │   ├── stocks.py           # Market-analysis endpoints
│   │   └── chat.py             # AI assistant endpoint
│   ├── ai/
│   │   ├── __init__.py
│   │   └── models.py           # AI model management
│   └── utils/
│       ├── __init__.py
│       └── logging.py          # Logging utilities
├── .env.example                # Safe configuration template
├── .env.local                  # Local credentials, ignored by Git
├── .gitignore
└── requirements.txt            # Python dependencies
```

## Environment Variables

Key configuration variables in `.env.local`:

- `DEBUG` - Enable debug mode (True/False)
- `API_PORT` - Server port (default: 8000)
- `CORS_ORIGINS` - Allowed CORS origins for frontend
- `MONGODB_URL` - MongoDB connection URL
- `OPENROUTER_API_KEY` - API key for OpenRouter
- `LOG_LEVEL` - Logging level (INFO, DEBUG, ERROR)

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:8080` (Frontend)
- `http://localhost:3000` (Alternative frontend)
- `http://127.0.0.1:8080`

Add production origins in `.env.local` if needed.

## Troubleshooting

### ImportError: No module named 'yfinance'
Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

### CORS errors from frontend
Check `.env.local` `CORS_ORIGINS` setting matches your frontend URL.

### Connection refused on port 8000
The port may be in use. Change it in `.env.local`:
```bash
API_PORT=8001
```

## Development Notes

- Stock data is fetched with yfinance; availability and quote delay depend on its provider.
- Technical indicators include RSI, MACD, and moving averages.
- The projection is a historical log-return baseline, not a trained model or a prediction guarantee.
- Portfolio holdings are stored only in the browser by the frontend.

## Production Deployment

For production:

1. Set `DEBUG=False` in `.env`
2. Use production database (MongoDB)
3. Configure appropriate `CORS_ORIGINS`
4. Use multiple workers: `--workers 4`
5. Set up proper logging and monitoring
6. Use environment-specific `.env` files

## Support

For issues or questions, check the API documentation at `/docs` when the server is running.
