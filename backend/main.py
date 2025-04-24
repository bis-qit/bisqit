from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from pydantic import BaseModel
from typing import List, Optional
from passlib.context import CryptContext

from routes import auth, users
from models.database import engine
from models import user
from models.quantum import SimulationResults, Circuit, Qubit
from config import settings

from simulator import simulate_circuit

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("bisqit")

# Configure password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
    bcrypt__ident="2b"
)

# Create database tables
user.Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for simulating quantum circuits using Qiskit"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)


class SimulationRequest(BaseModel):
    circuit: Circuit
    qubits: List[Qubit]
    shots: Optional[int] = settings.DEFAULT_SHOTS


class QasmRequest(BaseModel):
    circuit: Circuit
    qubits: List[Qubit]


@app.middleware("http")
async def exception_handling(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        logger.error(f"Unhandled exception: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(e)}"}
        )


@app.get("/")
def root():
    return {
        "message": "Welcome to the Bisqit API",
        "documentation": "/docs"
    }


@app.post("/simulate", response_model=SimulationResults)
def simulate_circuit_endpoint(request: SimulationRequest):
    """Simulate a quantum circuit and return the results"""
    try:
        logger.info(
            f"Simulating circuit with {len(request.circuit.gates)} gates on {len(request.qubits)} qubits")
        qubit_count = len(request.qubits)
        if qubit_count == 0:
            raise HTTPException(
                status_code=400, detail="Circuit must have at least one qubit")

        results = simulate_circuit(
            request.circuit.gates, qubit_count, request.shots)
        logger.info("Simulation completed successfully")
        return results

    except Exception as e:
        logger.error(f"Error in circuit simulation: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Simulation error: {str(e)}")


@app.post("/convert_to_qasm")
def convert_to_qasm(request: QasmRequest):
    """Convert a quantum circuit to QASM representation"""
    try:
        logger.info(
            f"Converting circuit with {len(request.circuit.gates)} gates to QASM")
        from qiskit import QuantumCircuit

        qubit_count = len(request.qubits)
        if qubit_count == 0:
            raise HTTPException(
                status_code=400, detail="Circuit must have at least one qubit")

        qc = QuantumCircuit(qubit_count)

        # Add gates to circuit
        from simulator import add_gate_to_circuit
        for gate in sorted(request.circuit.gates, key=lambda g: g.position):
            add_gate_to_circuit(qc, gate)

        # Generate QASM
        qasm_string = qc.qasm()
        logger.info("Successfully converted circuit to QASM")

        return {"qasm": qasm_string}

    except Exception as e:
        logger.error(f"Error generating QASM: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"QASM generation error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
