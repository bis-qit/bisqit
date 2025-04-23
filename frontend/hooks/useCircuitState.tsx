"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Gate,
  GateType,
  Qubit,
  Circuit,
  SimulationResults,
  Complex,
} from "@/lib/types";
import { simulateCircuit, generateQasmFromApi } from "@/lib/api";
import { toast } from "sonner";
import { error } from "console";

// Mock simulation function - in a real app, this would use a quantum simulation library
const mockSimulation = (
  circuit: Circuit,
  qubits: Qubit[]
): SimulationResults => {
  const qubitCount = qubits.length;
  const stateCount = Math.pow(2, qubitCount);

  // Generate mock state vector with random values
  const stateVector: Complex[] = Array.from({ length: stateCount }, () => {
    const magnitude = Math.random();
    const phase = Math.random() * 2 * Math.PI;
    return {
      re: magnitude * Math.cos(phase),
      im: magnitude * Math.sin(phase),
      magnitude,
      phase,
    };
  });

  // Normalize the state vector
  const totalProb = stateVector.reduce(
    (sum, state) => sum + Math.pow(state.magnitude, 2),
    0
  );
  const normalizedStateVector = stateVector.map((state) => ({
    ...state,
    magnitude: state.magnitude / Math.sqrt(totalProb),
  }));

  // Generate measurement probabilities
  const measurementProbabilities: { [outcome: string]: number } = {};
  normalizedStateVector.forEach((state, index) => {
    const binaryString = index.toString(2).padStart(qubitCount, "0");
    measurementProbabilities[binaryString] = Math.pow(state.magnitude, 2);
  });

  // Generate mock qubit states
  const qubitStates = qubits.map((_, i) => {
    return {
      stateVector: [
        { re: Math.random(), im: 0, magnitude: Math.random(), phase: 0 },
        {
          re: 0,
          im: Math.random(),
          magnitude: Math.random(),
          phase: Math.PI / 2,
        },
      ],
      probability: [Math.random(), Math.random()],
      blochSphereCoords: {
        x: Math.random() * 2 - 1,
        y: Math.random() * 2 - 1,
        z: Math.random() * 2 - 1,
      },
    };
  });

  return {
    qubitStates,
    measurementProbabilities,
    stateVector: normalizedStateVector,
  };
};

export function useCircuitState() {
  const [qubits, setQubits] = useState<Qubit[]>([
    { id: uuidv4(), index: 0 },
    { id: uuidv4(), index: 1 },
  ]);

  const [circuit, setCircuit] = useState<Circuit>({ gates: [] });
  const [selectedGate, setSelectedGate] = useState<GateType | null>(null);
  const [simulationResults, setSimulationResults] =
    useState<SimulationResults | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | null>(null);

  // Circuit manipulation functions
  const addQubit = useCallback(() => {
    setQubits((prev) => [...prev, { id: uuidv4(), index: prev.length }]);
  }, []);

  const removeQubit = useCallback(() => {
    if (qubits.length > 1) {
      const lastQubitIndex = qubits.length - 1;

      // Remove gates that involve this qubit
      setCircuit((prev) => ({
        ...prev,
        gates: prev.gates.filter(
          (gate) => !gate.qubitIndices.includes(lastQubitIndex)
        ),
      }));

      // Remove the qubit
      setQubits((prev) => prev.slice(0, -1));
    }
  }, [qubits]);

  const placeGate = useCallback(
    (position: number, qubitIndices: number[], color?: string) => {
      if (!selectedGate) return;

      const newGate: Gate = {
        id: uuidv4(),
        type: selectedGate,
        position,
        qubitIndices,
        parameters:
          selectedGate === "rx" ||
          selectedGate === "ry" ||
          selectedGate === "rz"
            ? { theta: 0 }
            : undefined,
        color,
      };

      setCircuit((prev) => ({
        ...prev,
        gates: [...prev.gates, newGate],
      }));
    },
    [selectedGate]
  );

  const removeGate = useCallback((gateId: string) => {
    setCircuit((prev) => ({
      ...prev,
      gates: prev.gates.filter((gate) => gate.id !== gateId),
    }));
  }, []);

  const moveGate = useCallback((gateId: string, newPosition: number) => {
    setCircuit((prev) => ({
      ...prev,
      gates: prev.gates.map((gate) =>
        gate.id === gateId ? { ...gate, position: newPosition } : gate
      ),
    }));
  }, []);

  const updateGateParameters = useCallback(
    (gateId: string, parameters: Gate["parameters"]) => {
      setCircuit((prev) => ({
        ...prev,
        gates: prev.gates.map((gate) =>
          gate.id === gateId ? { ...gate, parameters } : gate
        ),
      }));
    },
    []
  );

  const runSimulation = useCallback(async () => {
    if (circuit.gates.length === 0) {
      toast.warning("Empty circuit", {
        description: "Please add some gates to the circuit before simulating",
      });
      return;
    }

    setIsSimulating(true);
    setSimulationError(null);

    try {
      // Call the backend simulation API
      const results = await simulateCircuit(circuit, qubits);
      setSimulationResults(results);
      toast.success("Simulation completed", {
        description: "Quantum circuit simulation completed successfully",
      });
    } catch (error) {
      console.error("Simulation error:", error);
      setSimulationError(error instanceof Error ? error.message : "Unknown error occurred");

      // Fallback to mock simulation if the API call fails
      const mockResults = mockSimulation(circuit, qubits);
      setSimulationResults(mockResults);

      toast.error("Simulation API error", {
        description: "Using mock results instead. Check if the backend is running.",
      });
    } finally {
      setIsSimulating(false);
    }
  }, [circuit, qubits]);

  const generateQASM = useCallback(async () => {
    if (circuit.gates.length === 0) {
      toast.warning("Empty circuit", {
        description: "Please add some gates to the circuit before generating QASM",
      });
      return "";
    }

    try {
      // Fallback to local generation if the API call fails
      const header = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
      const qubitDeclaration = `qreg q[${qubits.length}];\ncreg c[${qubits.length}];\n\n`;

      // Sort gates by position
      const sortedGates = [...circuit.gates].sort(
        (a, b) => a.position - b.position
      );

      const gateInstructions = sortedGates
        .map((gate) => {
          switch (gate.type) {
            case "h":
              return `h q[${gate.qubitIndices[0]}];`;
            case "x":
              return `x q[${gate.qubitIndices[0]}];`;
            case "y":
              return `y q[${gate.qubitIndices[0]}];`;
            case "z":
              return `z q[${gate.qubitIndices[0]}];`;
            case "cx":
              return `cx q[${gate.qubitIndices[0]}],q[${gate.qubitIndices[1]}];`;
            case "swap":
              return `swap q[${gate.qubitIndices[0]}],q[${gate.qubitIndices[1]}];`;
            case "ccx":
              return `ccx q[${gate.qubitIndices[0]}],q[${gate.qubitIndices[1]}],q[${gate.qubitIndices[2]}];`;
            case "rx":
              return `rx(${gate.parameters?.theta || 0}) q[${gate.qubitIndices[0]
                }];`;
            case "ry":
              return `ry(${gate.parameters?.theta || 0}) q[${gate.qubitIndices[0]
                }];`;
            case "rz":
              return `rz(${gate.parameters?.theta || 0}) q[${gate.qubitIndices[0]
                }];`;
            case "s":
              return `s q[${gate.qubitIndices[0]}];`;
            case "t":
              return `t q[${gate.qubitIndices[0]}];`;
            case "cswap":
              return `cswap q[${gate.qubitIndices[0]}], q[${gate.qubitIndices[1]}], q[${gate.qubitIndices[2]}];`;
            default:
              return "";
          }
        })
        .join("\n");

      const measureInstructions = qubits
        .map((_, i) => `measure q[${i}] -> c[${i}];`)
        .join("\n");


      return `${header}${qubitDeclaration}${gateInstructions}\n\n${measureInstructions}`;
    }
    catch {

    }
  }, [circuit, qubits]);

  const clearCircuit = useCallback(() => {
    setCircuit((prev) => ({
      ...prev,
      gates: [],
    }));
  }, []);

  const addGate = useCallback((gate: Gate) => {
    setCircuit((prev) => ({
      ...prev,
      gates: [...prev.gates, gate],
    }));
  }, []);

  return {
    qubits,
    circuit,
    selectedGate,
    simulationResults,
    isSimulating,
    simulationError,
    setSelectedGate,
    addQubit,
    removeQubit,
    placeGate,
    removeGate,
    moveGate,
    updateGateParameters,
    runSimulation,
    generateQASM,
    clearCircuit,
    addGate,
  };
}
