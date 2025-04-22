# BisQit Backend

A FastAPI backend for the BisQit quantum circuit simulator that uses Qiskit for quantum circuit simulation.

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

## Installation

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Server

From the backend directory, run:

```bash
uvicorn main:app --reload
```

Or simply run:

```bash
python server.py
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, access the auto-generated API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /`: Root endpoint that returns a welcome message
- `POST /simulate`: Simulates a quantum circuit and returns the results
- `POST /convert_to_qasm`: Converts a quantum circuit to QASM representation

## Development

This backend is built with:

- FastAPI - For creating the API endpoints
- Qiskit - For quantum circuit simulation
- Pydantic - For data validation and settings management