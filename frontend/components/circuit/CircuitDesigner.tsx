"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GatePalette from "./GatePalette";
import CircuitGrid from "./CircuitGrid";
import CircuitControls from "./CircuitControls";
import SimulationResults from "../simulation/SimulationResults";
import QasmExportDialog from "../dialogs/QasmExportDialog";
import { useCircuitState } from "@/hooks/useCircuitState";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import ParameterDialog from "../dialogs/ParameterDialog";
import { findGateDefinition } from "@/lib/utils";
import { toast } from "sonner";
import { GateType } from "@/lib/types";

export default function CircuitDesigner() {
  const [isQasmDialogOpen, setIsQasmDialogOpen] = useState(false);
  const [qasmCode, setQasmCode] = useState("");
  const [activeDragData, setActiveDragData] = useState<{
    id: string;
    gateType?: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState("design");

  const {
    circuit,
    qubits,
    selectedGate,
    simulationResults,
    isSimulating,
    simulationError,
    addQubit,
    removeQubit,
    setSelectedGate,
    placeGate,
    removeGate,
    moveGate,
    runSimulation,
    generateQASM,
    clearCircuit,
    addGate,
  } = useCircuitState();

  const [paramDialogOpen, setParamDialogOpen] = useState(false);
  const [pendingGate, setPendingGate] = useState<{
    position: number;
    qubitIndex: number;
    gateType: string;
    color: string;
  } | null>(null);

  // Track which item is being dragged
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active.id.toString().startsWith("palette-")) {
      const gateType = active.id.toString().replace("palette-", "");
      setActiveDragData({ id: active.id.toString(), gateType });
    } else if (active.id.toString().startsWith("gate-")) {
      const gateId = active.id.toString().replace("gate-", "");
      const gate = circuit.gates.find((g) => g.id === gateId);
      if (gate) {
        setActiveDragData({ id: active.id.toString(), gateType: gate.type });
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Create a local copy of the active drag data to use after clearing the state
    const currentDragData = activeDragData;

    // Immediately clear the drag overlay by setting activeDragData to null
    setActiveDragData(null);

    // Only continue processing if we have a valid drag operation
    if (!over || !currentDragData || active.id === over.id) return;

    // Extract position and qubit information from the droppable ID
    const overData = over.id.toString().split("-");

    // Only proceed if dropped on a cell
    if (overData[0] === "cell") {
      const position = parseInt(overData[1]);
      const qubitIndex = parseInt(overData[2]);
      // Handle dropping from palette
      if (active.id.toString().startsWith("palette-")) {
        const gateType = active.id.toString().replace("palette-", "");
        const gateDefinition = findGateDefinition(gateType as any);

        if (gateDefinition) {
          // Get the appropriate color based on gate category
          const color = getCategoryColor(gateDefinition.category);

          if (gateDefinition.category === "parametric") {
            // Save the pending gate info and show the parameter dialog
            setPendingGate({
              position,
              qubitIndex,
              gateType,
              color,
            });
            setParamDialogOpen(true);
            return; // Wait for parameter dialog
          }

          // For single-qubit gates
          if (gateDefinition.category === "single") {
            placeGate(position, [qubitIndex], color);
          }
          // For multi-qubit gates
          else if (gateDefinition.category === "multi") {
            if (
              gateDefinition.type === "cx" ||
              gateDefinition.type === "swap"
            ) {
              // For 2-qubit gates
              if (qubitIndex + 1 < qubits.length) {
                placeGate(position, [qubitIndex, qubitIndex + 1], color);
              }
            } else if (
              gateDefinition.type === "ccx" ||
              gateDefinition.type === "cswap"
            ) {
              // For 3-qubit gates
              if (qubitIndex + 2 < qubits.length) {
                placeGate(
                  position,
                  [qubitIndex, qubitIndex + 1, qubitIndex + 2],
                  color
                );
              }
            }
          }
        }
      }
      // Handle moving an existing gate
      else if (active.id.toString().startsWith("gate-")) {
        const gateId = active.id.toString().replace("gate-", "");
        moveGate(gateId, position);
      }
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category: string) => {
    const categoryColors = {
      single: "#AFEEEE", // Light turquoise
      multi: "#DDA0DD", // Plum
      parametric: "#6CB4EE", // Sky blue
    };
    return categoryColors[category as keyof typeof categoryColors];
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleParameterConfirm = (theta: number) => {
    if (pendingGate) {
      // Create gate with the provided parameter
      const { position, qubitIndex, gateType, color } = pendingGate;

      // Create new gate with custom parameter
      const newGate = {
        id: uuidv4(),
        type: gateType,
        position,
        qubitIndices: [qubitIndex],
        parameters: { theta },
        color,
      };

      // Add the gate directly to the circuit
      addGate(newGate as any);

      // Reset pending gate and close dialog
      setPendingGate(null);
      setParamDialogOpen(false);
    }
  };

  const handleRunSimulation = () => {
    runSimulation();
    // Automatically switch to the simulation results tab
    setActiveTab("simulation");
  };

  const handleExportQASM = async () => {
    try {
      const qasmCode = await generateQASM();
      setQasmCode(qasmCode);
      setIsQasmDialogOpen(true);
    } catch (error) {
      console.error("Error generating QASM:", error);
      toast.error("Failed to generate QASM code");
    }
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <div className="flex flex-col gap-4 min-h-[calc(100vh-120px)]">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-full flex flex-col"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="design">Circuit Design</TabsTrigger>
            <TabsTrigger value="simulation">Simulation Results</TabsTrigger>
          </TabsList>

          <TabsContent value="design" className="mt-4 flex-1">
            <div className="flex flex-col lg:flex-row gap-4 h-full min-h-screen">
              {/* Left sidebar - Gate Palette */}
              <div className="w-full lg:w-80 h-auto min-h-[calc(100vh-240px)] p-4 border rounded-lg">
                <GatePalette
                  onSelectGate={setSelectedGate}
                  selectedGate={selectedGate}
                />
              </div>

              {/* Main area - Circuit Grid */}
              <div className="flex-1 border rounded-lg p-4 min-h-[500px] overflow-hidden">
                <div className="overflow-x-scroll hide-scrollbar pt-4">
                  <CircuitGrid
                    qubits={qubits}
                    circuit={circuit}
                    selectedGate={selectedGate}
                    onPlaceGate={(position, qubitIndices, color) =>
                      placeGate(position, qubitIndices, color)
                    }
                    onRemoveGate={removeGate}
                  />
                </div>
              </div>

              {/* Right sidebar - Circuit Controls */}
              <div className="w-full lg:w-64 p-4 border rounded-lg h-full">
                <CircuitControls
                  qubitCount={qubits.length}
                  onAddQubit={addQubit}
                  onRemoveQubit={removeQubit}
                  onRunSimulation={handleRunSimulation} // This passes our modified function
                  onExportQASM={handleExportQASM}
                  onClearCircuit={clearCircuit}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="simulation"
            className="mt-4 flex-1 h-[calc(100vh-200px)]"
          >
            <SimulationResults
              results={simulationResults}
              isLoading={isSimulating}
              error={simulationError}
            />
          </TabsContent>
        </Tabs>

        <QasmExportDialog
          isOpen={isQasmDialogOpen}
          setIsOpen={setIsQasmDialogOpen}
          qasmCode={qasmCode}
        />

        {/* Drag Overlay - Shows visual feedback during dragging */}
        <DragOverlay dropAnimation={null}>
          {activeDragData && (
            <div
              className="shadow-md rounded-md overflow-hidden"
              style={{
                width: "40px",
                height: getGateHeight(activeDragData.gateType),
                backgroundColor: getGateColor(activeDragData.gateType),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {renderGatePreview(activeDragData.gateType)}
            </div>
          )}
        </DragOverlay>
        {/* Parameter dialog */}
        <ParameterDialog
          isOpen={paramDialogOpen}
          onClose={() => {
            setParamDialogOpen(false);
            setPendingGate(null);
          }}
          onConfirm={handleParameterConfirm}
          gateName={
            pendingGate?.gateType
              ? findGateDefinition(pendingGate.gateType as any)?.name || ""
              : ""
          }
        />
      </div>
    </DndContext>
  );

  function renderGatePreview(gateType?: string) {
    const gateDefinition = findGateDefinition(gateType as any);

    if (!gateDefinition) return null;

    if (
      gateDefinition.category === "single" ||
      gateDefinition.category === "parametric"
    ) {
      return <div className="font-bold">{gateDefinition.symbol}</div>;
    }

    switch (gateDefinition.type) {
      case "cx":
        return (
          <div className="w-full h-full relative">
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
              <span className="font-bold text-orange-700 text-xs">X</span>
            </div>
          </div>
        );
      case "swap":
        return (
          <div className="w-full h-full relative">
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
          </div>
        );
      case "ccx":
        return (
          <div className="w-full h-full relative">
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
              <span className="font-bold text-amber-700 text-xs">X</span>
            </div>
          </div>
        );
      case "cswap":
        return (
          <div className="w-full h-full relative">
            {/* First control dot */}
            <div
              className="absolute w-3 h-3 rounded-full bg-amber-700 left-1/2 transform -translate-x-1/2"
              style={{ top: "13%" }}
            ></div>
            {/* Vertical line connecting all elements */}
            <div className="absolute w-[2px] h-[33%] bg-amber-700 left-1/2 transform -translate-x-1/2 top-[15%]"></div>
            {/* First X */}
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-amber-700 flex items-center justify-center left-1/2 transform -translate-x-1/2"
              style={{ top: "48%" }}
            >
              <span className="font-bold text-amber-700 text-xs">X</span>
            </div>
            <div className="absolute w-[2px] h-[20%] bg-amber-700 left-1/2 transform -translate-x-1/2 top-[58%]"></div>
            {/* Second X */}
            <div
              className="absolute w-5 h-5 rounded-full border-2 border-amber-700 flex items-center justify-center left-1/2 transform -translate-x-1/2"
              style={{ top: "78%" }}
            >
              <span className="font-bold text-amber-700 text-xs">X</span>
            </div>
          </div>
        );
      default:
        return <div className="font-bold">{gateDefinition.symbol}</div>;
    }
  }

  function getGateColor(gateType?: string): string {
    if (!gateType) return "#FFFFFF"; // Default for undefined
    const gateDefinition = findGateDefinition(gateType as any);
    if (gateDefinition) {
      return getCategoryColor(gateDefinition.category);
    }
    return "#FFFFFF"; // Default white if gate not found
  }

  function getGateHeight(gateType?: string): string {
    if (!gateType) return "40px"; // Default for undefined

    const gateDefinition = findGateDefinition(gateType as any);
    if (gateDefinition) {
      let qubitCount = 1; // Default for single-qubit gates

      if (gateDefinition.category === "multi") {
        if (gateType === "cx" || gateType === "swap") {
          qubitCount = 2;
        } else if (gateType === "ccx" || gateType === "cswap") {
          qubitCount = 3;
        }
      }

      // Calculate height based on number of qubits and cell height
      // We use 40px as default cell height for single-qubit gates
      return `${qubitCount * 60}px`;
    }
    return "60px"; // Default height
  }
}
