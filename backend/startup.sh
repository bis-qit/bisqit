#!/bin/bash
# Startup script for the BisQit FastAPI backend

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Install dependencies
pip install -r requirements.txt

uvicorn main:app --host 0.0.0.0 --port 8000 --reload