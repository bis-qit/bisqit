# Bisqit - Quantum Computing Platform

A quantum computing simulation platform for educational and research purposes.

## Project Structure

- **backend/**: FastAPI backend application
- **frontend/**: Next.js frontend application

## Features

- Quantum circuit simulation
- User authentication (login/register)
- Circuit visualization
- QASM export

## Database Setup

This project uses PostgreSQL as the database backend for user authentication and storing quantum circuits. PostgreSQL integrates seamlessly with FastAPI through SQLAlchemy.

### Setting up PostgreSQL

1. **Install PostgreSQL**:

   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # MacOS (using Homebrew)
   brew install postgresql
   ```

2. **Start PostgreSQL service**:

   ```bash
   # Ubuntu/Debian
   sudo service postgresql start
   
   # MacOS
   brew services start postgresql
   ```

3. **Create a database and user**:

   ```bash
   # Log into PostgreSQL as postgres user
   sudo -u postgres psql
   
   # Inside PostgreSQL shell
   CREATE USER bisqituser WITH PASSWORD 'your_secure_password';
   CREATE DATABASE bisqit WITH OWNER bisqituser;
   \q
   ```

4. **Configure environment variables**:
   
   Copy the example .env file and update it with your database credentials:
   
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env file with your database credentials
   # DATABASE_URL=postgresql://bisqituser:your_secure_password@localhost:5432/bisqit
   ```

## Backend Setup

1. **Create and activate a virtual environment (recommended)** :
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```


1. **Install Python dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the backend server**:

   ```bash
   cd backend
   python3 server.py
   ```

   The backend server will run at http://localhost:8000.


## Frontend Setup

1. **Install Node.js dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Set environment variables**:

   Create a `.env.local` file in the `frontend` directory:
   
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ```

3. **Run the development server**:

   ```bash
   cd frontend
   npm start
   ```

   The frontend will run at http://localhost:3000.

## Authentication System

The project includes a complete authentication system with:

- User registration
- User login with JWT tokens
- Protected routes requiring authentication
- Password security with bcrypt hashing

To access protected features:

1. Register a new account
2. Login with your credentials
3. The system will automatically redirect you to the dashboard

## Development

### API Endpoints

The backend provides the following main endpoints:

- **Authentication**:
  - `POST /api/v1/auth/register` - Register a new user
  - `POST /api/v1/auth/login` - Login and get JWT token
  - `GET /api/v1/users/me` - Get current user information

- **Quantum Computing**:
  - `POST /simulate` - Simulate a quantum circuit
  - `POST /convert_to_qasm` - Convert a circuit to QASM representation
