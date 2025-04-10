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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Measurement Probability Chart */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Measurement Probabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ProbabilityChart probabilities={results.measurementProbabilities} />
          </div>
        </CardContent>
      </Card>
      
      {/* State Vector */}
      <Card>
        <CardHeader>
          <CardTitle>State Vector</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] overflow-auto">
            <StateVectorDisplay stateVector={results.stateVector} />
          </div>
        </CardContent>
      </Card>
      
      {/* Individual Qubit States */}
      <Card>
        <CardHeader>
          <CardTitle>Qubit States</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qubit0" className="w-full">
            <TabsList className="w-full grid grid-flow-col auto-cols-fr">
              {results.qubitStates.map((_, i) => (
                <TabsTrigger key={i} value={`qubit${i}`}>Qubit {i}</TabsTrigger>
              ))}
            </TabsList>
            
            {results.qubitStates.map((qubitState, i) => (
              <TabsContent key={i} value={`qubit${i}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Qubit State Info */}
                  <div>
                    <h4 className="font-medium mb-2">State Representation</h4>
                    <div className="font-mono text-sm">
                      <p>|0⟩: {qubitState.stateVector[0].re.toFixed(4)} + {qubitState.stateVector[0].im.toFixed(4)}i</p>
                      <p>|1⟩: {qubitState.stateVector[1].re.toFixed(4)} + {qubitState.stateVector[1].im.toFixed(4)}i</p>
                    </div>
                    <h4 className="font-medium mt-4 mb-2">Probabilities</h4>
                    <div className="font-mono text-sm">
                      <p>P(|0⟩): {(qubitState.probability[0] * 100).toFixed(2)}%</p>
                      <p>P(|1⟩): {(qubitState.probability[1] * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  {/* Bloch Sphere Visualization */}
                  <div>
                    <h4 className="font-medium mb-2">Bloch Sphere</h4>
                    <div className="h-[200px] w-full">
                      <BlochSphereVisualization coordinates={qubitState.blochSphereCoords} />
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}