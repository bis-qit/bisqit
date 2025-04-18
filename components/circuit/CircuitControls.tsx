"use client"; //color on line 27
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, Play, Save, Terminal } from "lucide-react";
interface CircuitControlsProps {
  qubitCount: number;
  onAddQubit: () => void;
  onRemoveQubit: () => void;
  onRunSimulation: () => void;
  onExportQASM: () => void;
  onSaveCircuit?: () => void;
}
export default function CircuitControls({
  qubitCount,
  onAddQubit,
  onRemoveQubit,
  onRunSimulation,
  onExportQASM,
  onSaveCircuit = () => {},
}: CircuitControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card style={{ backgroundColor: "#A37CF0" }}>
        <CardHeader>
          <CardTitle className="text-lg">Circuit Controls</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
            <Button variant="outline" onClick={onExportQASM} className="w-full">
              <Terminal className="mr-2 w-4 h-4" /> Export QASM
            </Button>
            <Button
              variant="outline"
              onClick={onSaveCircuit}
              className="w-full transition-colors hover:bg-accent hover:text-accent-foreground hover:shadow-md"
            >
              <Save className="mr-2 w-4 h-4" /> Save Circuit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
