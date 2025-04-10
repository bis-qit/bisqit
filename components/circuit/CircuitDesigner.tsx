"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GatePalette from "./GatePalette";
import CircuitGrid from "./CircuitGrid";
import CircuitControls from "./CircuitControls";
import SimulationResults from "../simulation/SimulationResults";
import QasmExportDialog from "../dialogs/QasmExportDialog";
import { useCircuitState } from "@/hooks/useCircuitState";

export default function CircuitDesigner() {
  const [isQasmDialogOpen, setIsQasmDialogOpen] = useState(false);
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

  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="design" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="design">Circuit Design</TabsTrigger>
          <TabsTrigger value="simulation">Simulation Results</TabsTrigger>
        </TabsList>

        <TabsContent value="design" className="mt-4">
          <div className="flex flex-col lg:flex-row gap-4">
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
                onMoveGate={moveGate}
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

        <TabsContent value="simulation" className="mt-4">
          <SimulationResults results={simulationResults} />
        </TabsContent>
      </Tabs>

      <QasmExportDialog
        isOpen={isQasmDialogOpen}
        setIsOpen={setIsQasmDialogOpen}
        qasmCode={generateQASM()}
      />
    </div>
  );
}