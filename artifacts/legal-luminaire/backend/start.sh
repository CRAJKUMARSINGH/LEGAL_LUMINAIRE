#!/bin/bash
# Legal Luminaire Backend Startup Script

set -e

echo "=== Legal Luminaire Backend ==="

# Check .env exists
if [ ! -f ".env" ]; then
    echo "ERROR: .env not found. Copy .env.example to .env and add your API keys."
    echo "  cp .env.example .env"
    exit 1
fi

# Check Python
python --version || { echo "Python not found"; exit 1; }

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null

echo "Installing dependencies..."
pip install -r requirements.txt -q

echo "Starting server on http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
python main.py
