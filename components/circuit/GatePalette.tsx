"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GateType, GateDefinition } from "@/lib/types";

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

interface GatePaletteProps {
  onSelectGate: (gate: GateType | null) => void;
  selectedGate: GateType | null;
}

export default function GatePalette({ onSelectGate, selectedGate }: GatePaletteProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Gate Palette</h2>
      
      <Accordion type="single" collapsible defaultValue="single" className="w-full">
        <AccordionItem value="single">
          <AccordionTrigger>Single-Qubit Gates</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {gateDefinitions
                .filter(gate => gate.category === 'single')
                .map(gate => (
                  <GateButton 
                    key={gate.type} 
                    gate={gate} 
                    isSelected={selectedGate === gate.type}
                    onClick={() => onSelectGate(gate.type)} 
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="multi">
          <AccordionTrigger>Multi-Qubit Gates</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {gateDefinitions
                .filter(gate => gate.category === 'multi')
                .map(gate => (
                  <GateButton 
                    key={gate.type} 
                    gate={gate} 
                    isSelected={selectedGate === gate.type}
                    onClick={() => onSelectGate(gate.type)} 
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="parametric">
          <AccordionTrigger>Parametric Gates</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-2">
              {gateDefinitions
                .filter(gate => gate.category === 'parametric')
                .map(gate => (
                  <GateButton 
                    key={gate.type} 
                    gate={gate} 
                    isSelected={selectedGate === gate.type}
                    onClick={() => onSelectGate(gate.type)} 
                  />
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {selectedGate && (
        <Button 
          variant="outline" 
          className="mt-2 w-full"
          onClick={() => onSelectGate(null)}
        >
          Clear Selection
        </Button>
      )}
    </div>
  );
}

interface GateButtonProps {
  gate: GateDefinition;
  isSelected: boolean;
  onClick: () => void;
}

function GateButton({ gate, isSelected, onClick }: GateButtonProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isSelected ? "default" : "outline"}
            className={`w-full h-16 ${isSelected ? 'border-primary border-2' : ''}`}
            onClick={onClick}
          >
            <div className="flex flex-col items-center justify-center">
              <span className="text-lg font-bold">{gate.symbol}</span>
              <span className="text-xs">{gate.name}</span>
            </div>
          </Button>
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