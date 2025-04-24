"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Play, Terminal, Save, Plus, Minus, Trash2 } from "lucide-react";
import ClearCircuitDialog from "../dialogs/ClearCircuitDialog";
import { useState } from "react";
import { toast } from "sonner";
import { saveUserCircuit } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Circuit, Qubit } from "@/lib/types";

interface CircuitControlsProps {
  qubitCount: number;
  qubits: Qubit[];
  circuit: Circuit;
  onAddQubit: () => void;
  onRemoveQubit: () => void;
  onRunSimulation: () => void;
  onExportQASM: () => void;
  onSaveCircuit?: () => void;
  onClearCircuit: () => void;
}

export default function CircuitControls({
  qubitCount,
  qubits,
  circuit,
  onAddQubit,
  onRemoveQubit,
  onRunSimulation,
  onExportQASM,
  onSaveCircuit = () => {},
  onClearCircuit,
}: CircuitControlsProps) {
  const { isAuthenticated } = useAuth();
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCircuit = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to save circuits");
      return;
    }

    try {
      setIsSaving(true);
      await saveUserCircuit(circuit, qubits);
      toast.success("Circuit saved successfully");
    } catch (error) {
      console.error("Failed to save circuit:", error);
      toast.error("Failed to save circuit");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <ClearCircuitDialog
        open={isClearDialogOpen}
        onOpenChange={setIsClearDialogOpen}
        onConfirm={onClearCircuit}
      />

      <Card style={{ backgroundColor: "#A37CF0" }}>
        <CardHeader>
          <CardTitle className="text-lg">Circuit Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
            <p className="text-base font-semibold mb-4 qubits-text">
              Qubits: {qubitCount}
            </p>
              <div className="flex flex-col gap-2">
                <Button
                  // variant="outline"
                  size="sm"
                  onClick={onAddQubit}
                  className="w-full transition-colors hover:brightness-90 hover:shadow-md"
                  style={{ backgroundColor: "#0132FC" }}
                >
                  <Plus className="mr-1 w-4 h-4" /> Add Qubit
                </Button>

                <Button
                  // variant="outline"
                  size="sm"
                  onClick={onRemoveQubit}
                  disabled={qubitCount <= 1}
                  className="w-full transition-colors hover:brightness-90 hover:shadow-md"
                  style={{ backgroundColor: "#DD2C3A" }}
                >
                  <Minus className="mr-1 w-4 h-4" /> Remove Qubit
                </Button>

                <Button
                  size="sm"
                  onClick={() => setIsClearDialogOpen(true)}
                  className="w-full transition-colors hover:brightness-90 hover:shadow-md"
                  style={{ backgroundColor: "#FF4040" }}
                  variant="destructive"
                >
                  <Trash2 className="mr-2 w-4 h-4" /> Clear Circuit
                </Button>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Button
                variant="default"
                onClick={onRunSimulation}
                className="w-full transition-colors hover:bg-primary/90 hover:shadow-md"
              >
                <Play className="mr-2 w-4 h-4" /> Run Simulation
              </Button>

              <Button
                variant="outline"
                onClick={onExportQASM}
                className="w-full"
              >
                <Terminal className="mr-2 w-4 h-4" /> Export QASM
              </Button>

              {isAuthenticated && (
                <Button
                  variant="outline"
                  onClick={handleSaveCircuit}
                  disabled={isSaving}
                  className="w-full transition-colors hover:bg-accent hover:text-accent-foreground hover:shadow-md"
                >
                  <Save className="mr-2 w-4 h-4" />
                  {isSaving ? "Saving..." : "Save Circuit"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
