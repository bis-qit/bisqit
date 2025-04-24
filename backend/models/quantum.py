from pydantic import BaseModel
from typing import Dict, List, Optional


class GateParameters(BaseModel):
    theta: Optional[float] = None
    phi: Optional[float] = None
    lambda_param: Optional[float] = None


class Gate(BaseModel):
    id: str
    type: str
    position: int
    qubitIndices: List[int]
    parameters: Optional[GateParameters] = None
    color: Optional[str] = None


class Circuit(BaseModel):
    gates: List[Gate]


class Qubit(BaseModel):
    id: str
    index: int


class Complex(BaseModel):
    re: float
    im: float
    magnitude: float
    phase: float


class BlochSphereCoordinates(BaseModel):
    x: float
    y: float
    z: float


class QubitState(BaseModel):
    stateVector: List[Complex]
    probability: List[float]
    blochSphereCoords: BlochSphereCoordinates


class SimulationResults(BaseModel):
    qubitStates: List[QubitState]
    measurementProbabilities: Dict[str, float]
    stateVector: List[Complex]
