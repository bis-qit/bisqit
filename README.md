# BisQit - Quantum Circuit Simulator

A web-based quantum circuit simulator with a React frontend and FastAPI backend powered by Qiskit.

## Project Structure

The project is structured as follows:
- `frontend/`: React-based frontend for the quantum circuit interface
- `backend/`: FastAPI-based backend for quantum circuit simulation using Qiskit

## Features

- Interactive quantum circuit builder
- Support for standard quantum gates (H, X, Y, Z, S, T, CNOT, SWAP, etc.)
- Quantum circuit simulation using Qiskit
- Real-time visualization of quantum states and measurement probabilities
- QASM code export

## Backend

The backend is built with FastAPI and Qiskit, providing REST API endpoints for:
- Quantum circuit simulation
- Conversion to QASM representation

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the FastAPI server:
   ```
   uvicorn main:app --reload
   ```

   The API will be available at http://localhost:8000 with auto-generated documentation at http://localhost:8000/docs

## Frontend

The frontend is built with React and provides an interactive user interface for building and simulating quantum circuits.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

   The application will be available at http://localhost:3000

## Using the Application

1. Start both the backend and frontend servers
2. Use the frontend interface to build quantum circuits by adding gates
3. Run simulations to see the quantum state and measurement probabilities
4. Export your circuit to QASM format if needed

## Technologies Used

- **Frontend**: React, JavaScript
- **Backend**: FastAPI, Python
- **Quantum Simulation**: Qiskit
- **API Communication**: REST API
