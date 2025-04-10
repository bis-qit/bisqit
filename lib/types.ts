// Gate types
export type GateType = 
  // Single-qubit gates
  | 'h' // Hadamard
  | 'x' // Pauli-X
  | 'y' // Pauli-Y
  | 'z' // Pauli-Z
  // Multi-qubit gates
  | 'cx' // CNOT
  | 'swap' // SWAP
  | 'ccx' // Toffoli
  // Parametric gates
  | 'rx' // Rotation-X
  | 'ry' // Rotation-Y
  | 'rz'; // Rotation-Z

export type GateCategory = 'single' | 'multi' | 'parametric';

export interface Gate {
  id: string;
  type: GateType;
  position: number;
  qubitIndices: number[];
  parameters?: {
    theta?: number;
    phi?: number;
    lambda?: number;
  };
}

// Qubit types
export interface Qubit {
  id: string;
  index: number;
}

// Circuit types
export interface Circuit {
  gates: Gate[];
}

// Simulation result types
export interface QubitState {
  stateVector: Complex[];
  probability: number[];
  blochSphereCoords?: BlochSphereCoordinates;
}

export interface Complex {
  re: number;
  im: number;
  magnitude: number;
  phase: number;
}

export interface BlochSphereCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface SimulationResults {
  qubitStates: QubitState[];
  measurementProbabilities: { [outcome: string]: number };
  stateVector: Complex[];
}

export interface GateDefinition {
  type: GateType;
  symbol: string;
  name: string;
  category: GateCategory;
  description: string;
  hasParameters: boolean;
  maxQubits: number;
}