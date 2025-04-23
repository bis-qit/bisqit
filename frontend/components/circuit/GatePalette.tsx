"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { GateType, GateDefinition } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
// import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

// Gate definitions with their properties
const gateDefinitions: GateDefinition[] = [
  // Single-qubit gates
  {
    type: "h",
    symbol: "H",
    name: "Hadamard",
    category: "single",
    description: "Creates superposition by transforming |0⟩ into (|0⟩ + |1⟩)/√2 and |1⟩ into (|0⟩ - |1⟩)/√2.",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "x",
    symbol: "X",
    name: "Pauli-X",
    category: "single",
    description: "Quantum equivalent of the NOT gate; flips |0⟩ to |1⟩ and vice versa",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "y",
    symbol: "Y",
    name: "Pauli-Y",
    category: "single",
    description: "Applies a bit and phase flip; rotates the qubit 180° around the Y-axis on the Bloch sphere",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "z",
    symbol: "Z",
    name: "Pauli-Z",
    category: "single",
    description: "Applies a phase flip; leaves |0⟩ unchanged but flips the phase of |1⟩ to -|1⟩",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "s",
    symbol: "S",
    name: "Phase S",
    category: "single",
    description: "Adds a 90° phase shift to the |1⟩ state; leaves |0⟩ unchanged.",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "t",
    symbol: "T",
    name: "Phase T",
    category: "single",
    description: "Adds a 45° phase shift to the |1⟩ state.",
    hasParameters: false,
    maxQubits: 1,
  },
  // Multi-qubit gates
  {
    type: "cx",
    symbol: "•─X",
    name: "CNOT",
    category: "multi",
    description: "Flips the target qubit if the control qubit is |1⟩; essential for entanglement.",
    hasParameters: false,
    maxQubits: 2,
  },
  {
    type: "swap",
    symbol: "⨯─⨯",
    name: "SWAP",
    category: "multi",
    description: "Exchanges the states of two qubits.",
    hasParameters: false,
    maxQubits: 2,
  },
  {
    type: "ccx",
    symbol: "•─•─X",
    name: "Toffoli",
    category: "multi",
    description: "A controlled-controlled-NOT gate; flips the target qubit only if both control qubits are |1⟩.",
    hasParameters: false,
    maxQubits: 3,
  },
  {
    type: "cswap",
    symbol: "•─⨯─⨯",
    name: "Fredkin",
    category: "multi",
    description: "Swaps the states of two target qubits only if the control qubit is |1⟩.",
    hasParameters: false,
    maxQubits: 3,
  },
  // Parametric gates
  {
    type: "rx",
    symbol: "Rx",
    name: "Rotation X",
    category: "parametric",
    description: "Rotates the qubit state around the X-axis by a specified angle.",
    hasParameters: true,
    maxQubits: 1,
  },
  {
    type: "ry",
    symbol: "Ry",
    name: "Rotation Y",
    category: "parametric",
    description: "Rotates the qubit state around the Y-axis by a specified angle.",
    hasParameters: true,
    maxQubits: 1,
  },
  {
    type: "rz",
    symbol: "Rz",
    name: "Rotation Z",
    category: "parametric",
    description: "Rotates the qubit state around the Z-axis by a specified angle.",
    hasParameters: true,
    maxQubits: 1,
  },
];

interface GatePaletteProps {
  onSelectGate: (gate: GateType | null) => void;
  selectedGate: GateType | null;
}

export default function GatePalette({
  onSelectGate,
  selectedGate,
}: GatePaletteProps) {
  // Color mapping for different gate categories
  const categoryColors = {
    single: "#AFEEEE", // Light turquoise
    multi: "#DDA0DD", // Plum
    parametric: "#6CB4EE", // Sky blue
  };

  // Add state for search
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter gates based on search query
  const filteredSingleGates = gateDefinitions.filter(
    (gate) =>
      gate.category === "single" &&
      (!searchQuery.trim() ||
        gate.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMultiGates = gateDefinitions.filter(
    (gate) =>
      gate.category === "multi" &&
      (!searchQuery.trim() ||
        gate.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredParametricGates = gateDefinitions.filter(
    (gate) =>
      gate.category === "parametric" &&
      (!searchQuery.trim() ||
        gate.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4">
      <Card style={{ backgroundColor: "#A37CF0" }}>
        <CardHeader>
          <CardTitle className="text-lg">Gate Palette</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {/* Search bar with icon */}
          <div className="mb-2 relative">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Search gates..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-white/90 pl-8" // Added left padding to make room for the icon
            />
          </div>

          {/* Display gates by category with section headers */}
          <div className="space-y-4">
            {/* Single-qubit gates section */}
            {filteredSingleGates.length > 0 && (
              <div>
                <h3 className="py-2 font-medium text-md">Single-Qubit Gates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredSingleGates.map((gate) => (
                    <GateButton
                      key={gate.type}
                      gate={gate}
                      isSelected={selectedGate === gate.type}
                      onClick={() => onSelectGate(gate.type)}
                      color={categoryColors.single}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Multi-qubit gates section */}
            {filteredMultiGates.length > 0 && (
              <div>
                <h3 className="py-2 font-medium text-md">Multi-Qubit Gates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredMultiGates.map((gate) => (
                    <GateButton
                      key={gate.type}
                      gate={gate}
                      isSelected={selectedGate === gate.type}
                      onClick={() => onSelectGate(gate.type)}
                      color={categoryColors.multi}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Parametric gates section */}
            {filteredParametricGates.length > 0 && (
              <div>
                <h3 className="py-2 font-medium text-md">Parametric Gates</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filteredParametricGates.map((gate) => (
                    <GateButton
                      key={gate.type}
                      gate={gate}
                      isSelected={selectedGate === gate.type}
                      onClick={() => onSelectGate(gate.type)}
                      color={categoryColors.parametric}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Show message when no gates match the search */}
            {filteredSingleGates.length === 0 &&
              filteredMultiGates.length === 0 &&
              filteredParametricGates.length === 0 && (
                <div className="text-center py-4">
                  No gates match your search
                </div>
              )}
          </div>

          {/* {selectedGate && (
            <Button
              className="mt-2 w-full transition-colors hover:brightness-90 hover:shadow-md"
              onClick={() => onSelectGate(null)}
              style={{ backgroundColor: "#DD2C3A" }}
            >
              Clear Selection
            </Button>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
}

interface GateButtonProps {
  gate: GateDefinition;
  isSelected: boolean;
  onClick: () => void;
  color: string;
}

function GateButton({ gate, isSelected, onClick, color }: GateButtonProps) {
  // Add state to track whether info is shown
  const [showInfo, setShowInfo] = useState(false);
  
  // Make the gate button draggable
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${gate.type}`,
    data: {
      type: "palette-gate",
      gateType: gate.type,
    },
    disabled: !isSelected,
  });

  return (
    <div className="relative">
      <Button
        ref={setNodeRef}
        {...(isSelected ? { ...listeners, ...attributes } : {})}
        variant="outline"
        className={`w-full h-12 transition-all duration-150 ${
          isSelected
            ? "ring-2 ring-red-500 shadow-md transform scale-[1.02] border-2 border-red-500"
            : "hover:scale-[1.01] hover:shadow-sm"
        }`}
        onClick={onClick}
        style={{
          backgroundColor: color,
          // Add a subtle brightness change when selected
          filter: isSelected ? "brightness(1.1)" : "brightness(1)",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="text-md font-bold">{gate.symbol}</span>
          <span className="text-xs">{gate.name}</span>
        </div>
      </Button>

      {/* Information button */}
      <button
        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-sm hover:bg-gray-50"
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the parent button's onClick
          setShowInfo(!showInfo);
        }}
      >
        <span className="text-xs font-semibold">i</span>
      </button>
      
      {/* Information box that appears when info button is clicked */}
      {showInfo && (
        <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-md shadow-md p-3 border border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-sm">{gate.name}</h4>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowInfo(false);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-1">{gate.description}</p>
          {gate.maxQubits > 1 && (
            <p className="text-xs text-gray-600">Requires {gate.maxQubits} qubits</p>
          )}
          {gate.hasParameters && (
            <p className="text-xs text-gray-600">Has parameters</p>
          )}
        </div>
      )}
    </div>
  );
}
