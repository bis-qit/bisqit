"use client";

import { SimulationResults as SimResults } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProbabilityChart from "./ProbabilityChart";
import StateVectorDisplay from "./StateVectorDisplay";
import BlochSphereVisualization from "./BlochSphereVisualization";

interface SimulationResultsProps {
  results: SimResults | null;
}

export default function SimulationResults({ results }: SimulationResultsProps) {
  if (!results) {
    return (
      <div className="flex items-center justify-center p-10 border rounded-lg h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Simulation Results</h3>
          <p className="text-muted-foreground">Run a simulation to see results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {/* Measurement Probability Chart - upper left quarter (25%) */}
      <Card className="col-span-1 row-span-1">
        <CardHeader className="pb-2">
          <CardTitle>Measurement Probabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-full">
            <ProbabilityChart probabilities={results.measurementProbabilities} />
          </div>
        </CardContent>
      </Card>

      {/* Qubit States - entire right half (50%) */}
      <Card className="col-span-1 row-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Qubit States</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qubit0" className="w-full h-full">
            <TabsList className="w-full grid grid-flow-col auto-cols-fr">
              {results.qubitStates.map((_, i) => (
                <TabsTrigger key={i} value={`qubit${i}`}>Qubit {i}</TabsTrigger>
              ))}
            </TabsList>

            {results.qubitStates.map((qubitState, i) => (
              <TabsContent key={i} value={`qubit${i}`} className="h-full">
                <div className="grid grid-rows-5 grid-cols-2 gap-4 h-full">
                  {/* Bloch Sphere Visualization - 80% of height */}
                  <div className="row-span-4 col-span-2">
                    <div className="h-full">
                      <BlochSphereVisualization coordinates={qubitState.blochSphereCoords} />
                    </div>
                  </div>

                  {/* State Representation - bottom left */}
                  <div className="row-span-1 col-span-1">
                    <h4 className="font-medium mb-2">State Representation</h4>
                    <div className="font-mono text-sm">
                      <p>|0⟩: {qubitState.stateVector[0].re.toFixed(4)} + {qubitState.stateVector[0].im.toFixed(4)}i</p>
                      <p>|1⟩: {qubitState.stateVector[1].re.toFixed(4)} + {qubitState.stateVector[1].im.toFixed(4)}i</p>
                    </div>
                  </div>

                  {/* Probabilities - bottom right */}
                  <div className="row-span-1 col-span-1">
                    <h4 className="font-medium mb-2">Probabilities</h4>
                    <div className="font-mono text-sm">
                      <p>P(|0⟩): {(qubitState.probability[0] * 100).toFixed(2)}%</p>
                      <p>P(|1⟩): {(qubitState.probability[1] * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* State Vector - bottom left quarter (25%) */}
      <Card className="col-span-1 row-span-1">
        <CardHeader className="pb-2">
          <CardTitle>State Vector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] overflow-auto">
            <StateVectorDisplay stateVector={results.stateVector} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}