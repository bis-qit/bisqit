"use client";

import { Gate } from "@/lib/types";
import { useDraggable } from "@dnd-kit/core";
import { findGateDefinition } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `gate-${gate.id}`,
  });
  
  const gateDefinition = findGateDefinition(gate.type);
  
  if (!gateDefinition) {
    return null;
  }
  
  // Calculate position in the grid
  const left = gate.position * cellWidth + cellWidth;
  const top = gate.qubitIndices[0] * cellHeight;
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  // Calculate height for multi-qubit gates
  const height = gate.qubitIndices.length > 1 
    ? (gate.qubitIndices[gate.qubitIndices.length - 1] - gate.qubitIndices[0] + 1) * cellHeight
    : cellHeight;
  
  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: 'absolute',
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
                ${isDragging ? 'shadow-lg' : 'shadow-md'}
              `}
            >
              {/* Single qubit gate */}
              {(gateDefinition.category === 'single' || gateDefinition.category === 'parametric') && (
                <div className="font-bold text-center">
                    {gateDefinition.symbol}
                  {gate.parameters?.theta !== undefined && (
                    <span className="text-xs block">(θ={gate.parameters.theta.toFixed(1)})</span>
                  )}
                </div>
              )}
              
              {/* Multi qubit gate */}
              {gateDefinition.category === 'multi' && (
                <div className="w-full h-full relative">
                  {/* For CNOT */}
                  {gate.type === 'cx' && (
                    <>
                      <div className="absolute w-4 h-4 rounded-full bg-orange-700 top-[20px] left-[18px]"></div>
                      <div className="absolute w-full h-[2px] bg-orange-700 top-[30px]"></div>
                      <div className="absolute w-6 h-6 rounded-full border-2 border-orange-700 flex items-center justify-center top-[72px] left-[17px]">
                        <span className="font-bold text-orange-700">X</span>
                      </div>
                    </>
                  )}
                  
                  {/* For SWAP */}
                  {gate.type === 'swap' && (
                    <>
                      <div className="absolute w-6 h-6 font-bold text-xl top-[17px] left-[17px] text-cyan-700">×</div>
                      <div className="absolute w-full h-[2px] bg-cyan-700 top-[30px]"></div>
                      <div className="absolute w-6 h-6 font-bold text-xl top-[72px] left-[17px] text-cyan-700">×</div>
                    </>
                  )}
                  
                  {/* For Toffoli */}
                  {gate.type === 'ccx' && (
                    <>
                      <div className="absolute w-4 h-4 rounded-full bg-amber-700 top-[20px] left-[18px]"></div>
                      <div className="absolute w-full h-[2px] bg-amber-700 top-[30px]"></div>
                      <div className="absolute w-4 h-4 rounded-full bg-amber-700 top-[78px] left-[18px]"></div>
                      <div className="absolute w-full h-[2px] bg-amber-700 top-[90px]"></div>
                      <div className="absolute w-6 h-6 rounded-full border-2 border-amber-700 flex items-center justify-center top-[138px] left-[17px]">
                        <span className="font-bold text-amber-700">X</span>
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