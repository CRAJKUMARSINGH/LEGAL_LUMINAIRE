@echo off
echo === Legal Luminaire Backend ===

if not exist ".env" (
    echo ERROR: .env not found. Copy .env.example to .env and add your API keys.
    echo   copy .env.example .env
    pause
    exit /b 1
)

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt -q

echo Starting server on http://localhost:8000
echo API docs: http://localhost:8000/docs
python main.py
pause
