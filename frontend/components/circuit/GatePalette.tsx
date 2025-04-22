"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { GateType, GateDefinition } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Search } from "lucide-react";

// Gate definitions with their properties
const gateDefinitions: GateDefinition[] = [
  // Single-qubit gates
  {
    type: "h",
    symbol: "H",
    name: "Hadamard",
    category: "single",
    description: "Creates superposition",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "x",
    symbol: "X",
    name: "Pauli-X",
    category: "single",
    description: "Bit flip (NOT gate)",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "y",
    symbol: "Y",
    name: "Pauli-Y",
    category: "single",
    description: "Bit and phase flip",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "z",
    symbol: "Z",
    name: "Pauli-Z",
    category: "single",
    description: "Phase flip",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "s",
    symbol: "S",
    name: "Phase S",
    category: "single",
    description: "π/2 phase rotation",
    hasParameters: false,
    maxQubits: 1,
  },
  {
    type: "t",
    symbol: "T",
    name: "Phase T",
    category: "single",
    description: "π/4 phase rotation",
    hasParameters: false,
    maxQubits: 1,
  },
  // Multi-qubit gates
  {
    type: "cx",
    symbol: "•─X",
    name: "CNOT",
    category: "multi",
    description: "Controlled-X gate",
    hasParameters: false,
    maxQubits: 2,
  },
  {
    type: "swap",
    symbol: "⨯─⨯",
    name: "SWAP",
    category: "multi",
    description: "Swaps two qubits",
    hasParameters: false,
    maxQubits: 2,
  },
  {
    type: "ccx",
    symbol: "•─•─X",
    name: "Toffoli",
    category: "multi",
    description: "Controlled-Controlled-X gate",
    hasParameters: false,
    maxQubits: 3,
  },
  {
    type: "cswap",
    symbol: "•─⨯─⨯",
    name: "Fredkin",
    category: "multi",
    description: "Controlled-SWAP gate",
    hasParameters: false,
    maxQubits: 3,
  },
  // Parametric gates
  {
    type: "rx",
    symbol: "Rx",
    name: "Rotation X",
    category: "parametric",
    description: "Rotation around X-axis",
    hasParameters: true,
    maxQubits: 1,
  },
  {
    type: "ry",
    symbol: "Ry",
    name: "Rotation Y",
    category: "parametric",
    description: "Rotation around Y-axis",
    hasParameters: true,
    maxQubits: 1,
  },
  {
    type: "rz",
    symbol: "Rz",
    name: "Rotation Z",
    category: "parametric",
    description: "Rotation around Z-axis",
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <Button
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

            {/* Separate drag handle */}
            <div
              ref={setNodeRef}
              {...attributes}
              {...listeners}
              className="absolute top-0 right-0 p-1 cursor-grab hover:bg-gray-200 rounded-bl-md rounded-tr-md active:cursor-grabbing"
              style={{
                touchAction: "none",
                opacity: isDragging ? 0.5 : 0.8,
                zIndex: 10,
                background: "rgba(255,255,255,0.3)",
              }}
            >
              <DragHandleDots2Icon className="h-4 w-4" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{gate.description}</p>
          {gate.maxQubits > 1 && <p>Requires {gate.maxQubits} qubits</p>}
          {gate.hasParameters && <p>Has parameters</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
