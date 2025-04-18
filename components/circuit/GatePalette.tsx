"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GateType, GateDefinition } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

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

  return (
    <div className="flex flex-col gap-4">
      <Card style={{ backgroundColor: "#A37CF0" }}>
        <CardHeader>
          <CardTitle className="text-lg">Gate Palette</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Accordion
            type="multiple"
            defaultValue={["single"]}
            className="w-full"
          >
            <AccordionItem value="single">
              <AccordionTrigger className="py-2 [&>svg]:text-black [&>svg]:opacity-100 [&>svg]:w-5 [&>svg]:h-5 font-medium">
                Single-Qubit Gates
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {gateDefinitions
                    .filter((gate) => gate.category === "single")
                    .map((gate) => (
                      <GateButton
                        key={gate.type}
                        gate={gate}
                        isSelected={selectedGate === gate.type}
                        onClick={() => onSelectGate(gate.type)}
                        color={categoryColors.single}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="multi">
              <AccordionTrigger className="py-2 [&>svg]:text-black [&>svg]:opacity-100 [&>svg]:w-5 [&>svg]:h-5 font-medium">
                Multi-Qubit Gates
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {gateDefinitions
                    .filter((gate) => gate.category === "multi")
                    .map((gate) => (
                      <GateButton
                        key={gate.type}
                        gate={gate}
                        isSelected={selectedGate === gate.type}
                        onClick={() => onSelectGate(gate.type)}
                        color={categoryColors.multi}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="parametric">
              <AccordionTrigger className="py-2 [&>svg]:text-black [&>svg]:opacity-100 [&>svg]:w-5 [&>svg]:h-5 font-medium">
                Parametric Gates
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-2">
                  {gateDefinitions
                    .filter((gate) => gate.category === "parametric")
                    .map((gate) => (
                      <GateButton
                        key={gate.type}
                        gate={gate}
                        isSelected={selectedGate === gate.type}
                        onClick={() => onSelectGate(gate.type)}
                        color={categoryColors.parametric}
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {selectedGate && (
            <Button
              className="mt-2 w-full transition-colors hover:brightness-90 hover:shadow-md"
              onClick={() => onSelectGate(null)}
              style={{ backgroundColor: "#DD2C3A" }}
            >
              Clear Selection
            </Button>
          )}
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
              variant={isSelected ? "default" : "outline"}
              className={`w-full h-12 ${
                isSelected ? "border-primary border-2" : ""
              }`}
              onClick={onClick}
              style={{ backgroundColor: isSelected ? undefined : color }}
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
