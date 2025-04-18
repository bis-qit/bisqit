"use client";

import { Gate } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { findGateDefinition } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X } from "lucide-react";

interface GateComponentProps {
  gate: Gate;
  cellWidth: number;
  cellHeight: number;
  qubitCount: number;
  onRemove: () => void;
}

export default function GateComponent({
  gate,
  cellWidth,
  cellHeight,
  qubitCount,
  onRemove,
}: GateComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `gate-${gate.id}`,
    });

  const gateDefinition = findGateDefinition(gate.type);

  if (!gateDefinition) {
    return null;
  }

  // Calculate position in the grid
  const left = gate.position * cellWidth + cellWidth;
  const top = gate.qubitIndices[0] * cellHeight;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Calculate height for multi-qubit gates
  const height =
    gate.qubitIndices.length > 1
      ? (gate.qubitIndices[gate.qubitIndices.length - 1] -
          gate.qubitIndices[0] +
          1) *
        cellHeight
      : cellHeight;

  const backgroundColor =
    gate.color ||
    (gateDefinition.category === "single"
      ? "#AFEEEE"
      : gateDefinition.category === "multi"
      ? "#DDA0DD"
      : gateDefinition.category === "parametric"
      ? "#6CB4EE"
      : "#FFFFFF");

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "absolute",
        width: `${cellWidth}px`,
        height: `${height}px`,
        left: `${left}px`,
        top: `${top}px`,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 100 : 10,
      }}
      {...attributes}
      {...listeners}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`
                w-full h-full flex flex-col items-center justify-center 
                relative rounded-md cursor-grab active:cursor-grabbing
                ${isDragging ? "shadow-lg" : "shadow-md"}
              `}
              style={{ backgroundColor }}
            >
              {/* Single qubit gate or parametric gate */}
              {(gateDefinition.category === "single" ||
                gateDefinition.category === "parametric") && (
                <div className="font-bold text-center">
                  {gateDefinition.symbol}
                  {gate.parameters?.theta !== undefined && (
                    <span className="text-xs block">
                      (θ={gate.parameters.theta.toFixed(1)})
                    </span>
                  )}
                </div>
              )}

              {/* Multi qubit gate */}
              {gateDefinition.category === "multi" && (
                <div className="w-full h-full relative">
                  {/* For CNOT */}
                  {gate.type === "cx" && (
                    <>
                      {/* Control dot */}
                      <div
                        className="absolute w-3 h-3 rounded-full bg-orange-700 left-1/2 transform -translate-x-1/2"
                        style={{ top: "20%" }}
                      ></div>
                      {/* Vertical line connecting control to target */}
                      <div className="absolute w-[2px] h-[50%] bg-orange-700 left-1/2 transform -translate-x-1/2 top-[20%]"></div>
                      {/* Target X */}
                      <div
                        className="absolute w-5 h-5 rounded-full border-2 border-orange-700 flex items-center justify-center left-1/2 transform -translate-x-1/2"
                        style={{ top: "70%" }}
                      >
                        <span className="font-bold text-orange-700 text-xs">
                          X
                        </span>
                      </div>
                    </>
                  )}

                  {/* For SWAP */}
                  {gate.type === "swap" && (
                    <>
                      {/* Top X */}
                      <div
                        className="absolute font-bold text-cyan-700 text-xl left-1/2 transform -translate-x-1/2"
                        style={{ top: "13%" }}
                      >
                        ×
                      </div>
                      {/* Vertical line connecting Xs */}
                      <div className="absolute w-[2px] h-[50%] bg-cyan-700 left-1/2 transform -translate-x-1/2 top-[25%]"></div>
                      {/* Bottom X */}
                      <div
                        className="absolute font-bold text-cyan-700 text-xl left-1/2 transform -translate-x-1/2"
                        style={{ top: "63%" }}
                      >
                        ×
                      </div>
                    </>
                  )}

                  {/* For Toffoli */}
                  {gate.type === "ccx" && (
                    <>
                      {/* First control dot */}
                      <div
                        className="absolute w-3 h-3 rounded-full bg-amber-700 left-1/2 transform -translate-x-1/2"
                        style={{ top: "13%" }}
                      ></div>
                      {/* Vertical line connecting all elements */}
                      <div className="absolute w-[2px] h-[64%] bg-amber-700 left-1/2 transform -translate-x-1/2 top-[15%]"></div>
                      {/* Second control dot */}
                      <div
                        className="absolute w-3 h-3 rounded-full bg-amber-700 left-1/2 transform -translate-x-1/2"
                        style={{ top: "47%" }}
                      ></div>
                      {/* Target X */}
                      <div
                        className="absolute w-5 h-5 rounded-full border-2 border-amber-700 flex items-center justify-center left-1/2 transform -translate-x-1/2"
                        style={{ top: "78%" }}
                      >
                        <span className="font-bold text-amber-700 text-xs">
                          X
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Remove button */}
              <button
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{gateDefinition.name}</p>
            <p className="text-xs">{gateDefinition.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
