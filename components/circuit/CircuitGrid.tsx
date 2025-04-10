"use client";    // color at line 90

import { useRef, useState} from "react";
import { Gate, Qubit, GateType } from "@/lib/types";
import { findGateDefinition } from "@/lib/utils";
import { DndContext,  useDroppable, DragEndEvent } from "@dnd-kit/core";
import GateComponent from "./GateComponent";

interface CircuitGridProps {
  qubits: Qubit[];
  circuit: { gates: Gate[] };
  selectedGate: GateType | null;
  onPlaceGate: (position: number, qubitIndices: number[]) => void;
  onRemoveGate: (gateId: string) => void;
  onMoveGate: (gateId: string, newPosition: number) => void;
}

export default function CircuitGrid({
  qubits,
  circuit,
  selectedGate,
  onPlaceGate,
  onRemoveGate,
  onMoveGate,
}: CircuitGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridCells, setGridCells] = useState<number>(20); // Number of time steps
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  
  // Generate grid cells for each qubit
  const cellWidth = 50;
  const cellHeight = 60;
  
  // Handle drag end for gates
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Extract position and qubit information from the droppable ID
      const overData = over.id.toString().split('-');
      const position = parseInt(overData[1]);
      const qubitIndex = parseInt(overData[2]);
      
      if (active.id.toString().startsWith('gate-')) {
        // Moving an existing gate
        const gateId = active.id.toString().replace('gate-', '');
        onMoveGate(gateId, position);
      } else if (selectedGate) {
        // Place a new gate
        const gateDefinition = findGateDefinition(selectedGate);
        if (gateDefinition) {
          // For single-qubit gates
          if (gateDefinition.category === 'single' || gateDefinition.category === 'parametric') {
            onPlaceGate(position, [qubitIndex]);
          } 
          // For multi-qubit gates, we need to select multiple qubits
          else if (gateDefinition.category === 'multi') {
            if (gateDefinition.type === 'cx' || gateDefinition.type === 'swap') {
              // For 2-qubit gates, let's place them on consecutive qubits
              // In a real app, you'd want a more sophisticated selection mechanism
              if (qubitIndex + 1 < qubits.length) {
                onPlaceGate(position, [qubitIndex, qubitIndex + 1]);
              }
            } else if (gateDefinition.type === 'ccx') {
              // For 3-qubit gates, place on three consecutive qubits
              if (qubitIndex + 2 < qubits.length) {
                onPlaceGate(position, [qubitIndex, qubitIndex + 1, qubitIndex + 2]);
              }
            }
          }
        }
      }
    }
    
    setDraggedGate(null);
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div 
        ref={gridRef}
        className="relative"
        style={{
          width: `${cellWidth * (gridCells + 2)}px`,
          minHeight: `${cellHeight * qubits.length}px`,
          
        }}
      >
        {/* Circuit grid background */}
        <div className="absolute inset-0" /*style = {{backgroundColor: "#041E42" }}*/>
          {qubits.map((qubit, qubitIndex) => (
            <div 
              key={qubit.id} 
              className="flex items-center h-[60px] relative"
            >
              {/* Qubit label */}
              <div 
                className="w-[50px] h-full flex items-center justify-center font-mono text-sm"
              >
                q<sub>{qubit.index}</sub>
              </div>
              
              {/* Qubit wire */}
              <div className="flex-1 h-[2px] bg-gray-300 relative">
                {/* Grid cells for gate placement */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex">
                  {Array.from({ length: gridCells }).map((_, position) => (
                    <DropZone 
                      key={position}
                      id={`cell-${position}-${qubitIndex}`}
                      width={cellWidth} 
                      height={cellHeight}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
          
          {/* Measurement dashed line */}
          <div 
            className="absolute top-0 bottom-0 border-l-2 border-dashed border-gray-500"
            style={{ left: `${cellWidth * (gridCells - 2) + 25}px` }}
          />
        </div>
        
        {/* Gates */}
        {circuit.gates.map((gate) => (
          <GateComponent 
            key={gate.id}
            gate={gate}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            qubitCount={qubits.length}
            onRemove={() => onRemoveGate(gate.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}

interface DropZoneProps {
  id: string;
  width: number;
  height: number;
}

function DropZone({ id, width, height }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });
  
  return (
    <div
      ref={setNodeRef}
      className={`transition-colors ${isOver ? 'bg-primary-100 opacity-50' : ''}`}
      style={{
        width,
        height,
      }}
    />
  );
}