import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Gate, GateDefinition, GateType } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Gate definitions with their properties
const gateDefinitions: GateDefinition[] = [
  // Single-qubit gates
  {
    type: 'h',
    symbol: 'H',
    name: 'Hadamard',
    category: 'single',
    description: 'Creates superposition',
    hasParameters: false,
    maxQubits: 1
  },
  {
    type: 'x',
    symbol: 'X',
    name: 'Pauli-X',
    category: 'single',
    description: 'Bit flip (NOT gate)',
    hasParameters: false,
    maxQubits: 1
  },
  {
    type: 'y',
    symbol: 'Y',
    name: 'Pauli-Y',
    category: 'single',
    description: 'Bit and phase flip',
    hasParameters: false,
    maxQubits: 1
  },
  {
    type: 'z',
    symbol: 'Z',
    name: 'Pauli-Z',
    category: 'single',
    description: 'Phase flip',
    hasParameters: false,
    maxQubits: 1
  },
  // Multi-qubit gates
  {
    type: 'cx',
    symbol: '•─X',
    name: 'CNOT',
    category: 'multi',
    description: 'Controlled-X gate',
    hasParameters: false,
    maxQubits: 2
  },
  {
    type: 'swap',
    symbol: '⨯─⨯',
    name: 'SWAP',
    category: 'multi',
    description: 'Swaps two qubits',
    hasParameters: false,
    maxQubits: 2
  },
  {
    type: 'ccx',
    symbol: '•─•─X',
    name: 'Toffoli',
    category: 'multi',
    description: 'Controlled-Controlled-X gate',
    hasParameters: false,
    maxQubits: 3
  },
  // Parametric gates
  {
    type: 'rx',
    symbol: 'Rx',
    name: 'Rotation X',
    category: 'parametric',
    description: 'Rotation around X-axis',
    hasParameters: true,
    maxQubits: 1
  },
  {
    type: 'ry',
    symbol: 'Ry',
    name: 'Rotation Y',
    category: 'parametric',
    description: 'Rotation around Y-axis',
    hasParameters: true,
    maxQubits: 1
  },
  {
    type: 'rz',
    symbol: 'Rz',
    name: 'Rotation Z',
    category: 'parametric',
    description: 'Rotation around Z-axis',
    hasParameters: true,
    maxQubits: 1
  }
];

export const findGateDefinition = (gateType: GateType): GateDefinition | undefined => {
  return gateDefinitions.find(gate => gate.type === gateType);
};

export const getAllGateDefinitions = (): GateDefinition[] => {
  return [...gateDefinitions];
};

export const formatComplex = (complex: { re: number; im: number }): string => {
  const realPart = complex.re.toFixed(4);
  const imagPart = complex.im >= 0 
    ? `+ ${complex.im.toFixed(4)}i` 
    : `- ${Math.abs(complex.im).toFixed(4)}i`;
  
  return `${realPart} ${imagPart}`;
};

export const calculateCellPosition = (position: number, cellWidth: number): number => {
  return position * cellWidth + cellWidth;
};

// Helper function for detecting mobile devices
export const isMobileDevice = (): boolean => {
  return typeof window !== 'undefined' && 
    (window.innerWidth <= 768 || 
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
};
