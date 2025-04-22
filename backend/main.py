from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import logging
from typing import Dict, List, Optional, Union

from models import Gate, SimulationResults, Circuit, Qubit
from simulator import simulate_circuit
from config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger("bisqit")

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.API_VERSION,
    description="API for simulating quantum circuits using Qiskit"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models


class SimulationRequest(BaseModel):
    circuit: Circuit
    qubits: List[Qubit]
    shots: Optional[int] = settings.DEFAULT_SHOTS


class QasmRequest(BaseModel):
    circuit: Circuit
    qubits: List[Qubit]

# Error handling middleware


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
def read_root():
    return {"message": "BisQit Quantum Circuit Simulator API", "version": settings.API_VERSION}


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
