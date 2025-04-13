"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GatePalette from "./GatePalette";
import CircuitGrid from "./CircuitGrid";
import CircuitControls from "./CircuitControls";
import SimulationResults from "../simulation/SimulationResults";
import QasmExportDialog from "../dialogs/QasmExportDialog";
import { useCircuitState } from "@/hooks/useCircuitState";
import { DndContext, DragEndEvent, DragStartEvent, DragOverlay } from "@dnd-kit/core";
import { findGateDefinition } from "@/lib/utils";

export default function CircuitDesigner() {
  const [isQasmDialogOpen, setIsQasmDialogOpen] = useState(false);
  const [activeDragData, setActiveDragData] = useState<{
    id: string;
    gateType?: string;
  } | null>(null);
  
  const {
    circuit,
    qubits,
    selectedGate,
    simulationResults,
    addQubit,
    removeQubit,
    setSelectedGate,
    placeGate,
    removeGate,
    moveGate,
    runSimulation,
    generateQASM
  } = useCircuitState();

  // Track which item is being dragged
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    if (active.id.toString().startsWith('palette-')) {
      const gateType = active.id.toString().replace('palette-', '');
      setActiveDragData({ id: active.id.toString(), gateType });
    } else if (active.id.toString().startsWith('gate-')) {
      const gateId = active.id.toString().replace('gate-', '');
      const gate = circuit.gates.find(g => g.id === gateId);
      if (gate) {
        setActiveDragData({ id: active.id.toString(), gateType: gate.type });
      }
    }
  };

  // Handle drag end for both palette items and existing gates
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragData(null);
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Extract position and qubit information from the droppable ID
      const overData = over.id.toString().split('-');
      
      // Only proceed if dropped on a cell
      if (overData[0] === 'cell') {
        const position = parseInt(overData[1]);
        const qubitIndex = parseInt(overData[2]);
        
        // Check if dragging from palette
        if (active.id.toString().startsWith('palette-')) {
          const gateType = active.id.toString().replace('palette-', '');
          const gateDefinition = findGateDefinition(gateType as any);
          
          if (gateDefinition) {
            // For single-qubit gates
            if (gateDefinition.category === 'single' || gateDefinition.category === 'parametric') {
              placeGate(position, [qubitIndex]);
            } 
            // For multi-qubit gates
            else if (gateDefinition.category === 'multi') {
              if (gateDefinition.type === 'cx' || gateDefinition.type === 'swap') {
                // For 2-qubit gates
                if (qubitIndex + 1 < qubits.length) {
                  placeGate(position, [qubitIndex, qubitIndex + 1]);
                }
              } else if (gateDefinition.type === 'ccx') {
                // For 3-qubit gates
                if (qubitIndex + 2 < qubits.length) {
                  placeGate(position, [qubitIndex, qubitIndex + 1, qubitIndex + 2]);
                }
              }
            }
          }
        }
        // Dragging an existing gate
        else if (active.id.toString().startsWith('gate-')) {
          const gateId = active.id.toString().replace('gate-', '');
          moveGate(gateId, position);
        }
      }
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 min-h-[calc(100vh-120px)]">
        <Tabs defaultValue="design" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="design">Circuit Design</TabsTrigger>
            <TabsTrigger value="simulation">Simulation Results</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-4 flex-1">
            <div className="flex flex-col lg:flex-row gap-4 h-full">
              {/* Left sidebar - Gate Palette */}
              <div className="w-full lg:w-64 h-auto lg:h-[calc(100vh-240px)] overflow-y-auto p-4 border rounded-lg">
                <GatePalette onSelectGate={setSelectedGate} selectedGate={selectedGate} />
              </div>

              {/* Main area - Circuit Grid */}
              <div className="flex-1 border rounded-lg p-4 min-h-[500px] overflow-x-auto">
                <CircuitGrid
                  qubits={qubits}
                  circuit={circuit}
                  selectedGate={selectedGate}
                  onPlaceGate={placeGate}
                  onRemoveGate={removeGate}
                />
              </div>

              {/* Right sidebar - Circuit Controls */}
              <div className="w-full lg:w-64 p-4 border rounded-lg">
                <CircuitControls
                  qubitCount={qubits.length}
                  onAddQubit={addQubit}
                  onRemoveQubit={removeQubit}
                  onRunSimulation={runSimulation}
                  onExportQASM={() => setIsQasmDialogOpen(true)}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="mt-4 flex-1 h-[calc(100vh-200px)]">
            <SimulationResults results={simulationResults} />
          </TabsContent>
        </Tabs>

        <QasmExportDialog
          isOpen={isQasmDialogOpen}
          setIsOpen={setIsQasmDialogOpen}
          qasmCode={generateQASM()}
        />
        
        {/* Drag Overlay - Shows visual feedback during dragging */}
        {activeDragData && (
          <DragOverlay>
            <div className="w-[50px] h-[50px] bg-white shadow-lg rounded-md flex items-center justify-center border-2 border-primary">
              {activeDragData.gateType && (
                <div className="font-bold">
                  {findGateDefinition(activeDragData.gateType as any)?.symbol || activeDragData.gateType}
                </div>
              )}
            </div>
          </DragOverlay>
        )}
      </div>
    </DndContext>
  );
}