"use client";

import { useRef, useState } from "react";
import { Gate, Qubit, GateType } from "@/lib/types";
import { useDroppable } from "@dnd-kit/core";
import GateComponent from "./GateComponent";

interface CircuitGridProps {
  qubits: Qubit[];
  circuit: { gates: Gate[] };
  selectedGate: GateType | null;
  onPlaceGate: (
    position: number,
    qubitIndices: number[],
    color?: string
  ) => void;
  onRemoveGate: (gateId: string) => void;
}

export default function CircuitGrid({
  qubits,
  circuit,
  selectedGate,
  onPlaceGate,
  onRemoveGate,
}: CircuitGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridCells, setGridCells] = useState<number>(20); // Number of time steps

  // Generate grid cells for each qubit
  const cellWidth = 55;
  const cellHeight = 55;

  return (
    <div
      ref={gridRef}
      className="relative"
      style={{
        width: `${cellWidth * (gridCells + 2)}px`,
        minHeight: `${cellHeight * qubits.length}px`,
      }}
    >
      {/* Circuit grid background */}
      <div className="absolute inset-0">
        {qubits.map((qubit, qubitIndex) => (
          <div key={qubit.id} className="flex items-center h-[60px] relative">
            {/* Qubit label */}
            <div className="w-[50px] h-full flex items-center justify-center font-mono text-sm">
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
      className={`transition-colors duration-200 ${
        isOver
          ? "bg-primary/20 border-2 border-primary border-dashed"
          : "border border-transparent hover:border-gray-300 hover:bg-gray-50"
      }`}
      style={{
        width,
        height,
        borderRadius: "4px",
      }}
    />
  );
}

// before update
