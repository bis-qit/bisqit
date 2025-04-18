"use client";

import { SimulationResults as SimResults } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProbabilityChart from "./ProbabilityChart";
import StateVectorDisplay from "./StateVectorDisplay";
import BlochSphereVisualization from "./BlochSphereVisualization";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";

interface SimulationResultsProps {
  results: SimResults | null;
}

export default function SimulationResults({ results }: SimulationResultsProps) {
  if (!results) {
    return (
      <div className="flex items-center justify-center p-10 border rounded-lg h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Simulation Results</h3>
          <p className="text-muted-foreground">
            Run a simulation to see results here.
          </p>
        </div>
      </div>
    );
  }

  // Function to download the probability chart as PNG
  const downloadProbabilityChart = () => {
    const svgElement = document.querySelector(".probability-chart svg");
    if (!svgElement) return;

    // Create a canvas with the same dimensions as the SVG
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions
    const svgRect = svgElement.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;

    // Create an image from SVG data
    const img = new Image();
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Draw the image on the canvas (with white background)
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL and trigger download
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "probability-chart.png";
        link.href = dataUrl;
        link.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const downloadStateVector = () => {
    // Get state vector data directly from results
    const stateVector = results.stateVector;
    if (!stateVector) return;

    // Create canvas with appropriate dimensions
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions - adjust as needed for your state vector size
    const numStates = stateVector.length;
    const rowHeight = 24;
    const padding = 20;
    const width = 400;
    const height = Math.max(200, numStates * rowHeight + 2 * padding);

    canvas.width = width;
    canvas.height = height;

    // Fill white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // Set title
    ctx.fillStyle = "#111827"; // Dark color for text
    ctx.font = "bold 16px Arial";
    ctx.fillText("State Vector", padding, padding);

    // Draw state vector entries
    ctx.font = "14px monospace";
    stateVector.forEach((state, i) => {
      const binary = i.toString(2).padStart(Math.log2(numStates), "0");
      const stateLabel = `|${binary}⟩:`;
      const stateValue = `${state.re.toFixed(4)} ${
        state.im >= 0 ? "+" : ""
      }${state.im.toFixed(4)}i`;

      // Label
      ctx.fillStyle = "#374151"; // Gray for labels
      ctx.fillText(stateLabel, padding, padding + 30 + i * rowHeight);

      // Value
      ctx.fillStyle = "#111827"; // Dark for values
      ctx.fillText(stateValue, padding + 80, padding + 30 + i * rowHeight);

      // Probability (optional)
      const prob = (Math.pow(state.re, 2) + Math.pow(state.im, 2)) * 100;
      ctx.fillStyle = "#6B7280"; // Lighter gray for probability
      ctx.fillText(
        `(${prob.toFixed(2)}%)`,
        padding + 240,
        padding + 30 + i * rowHeight
      );
    });

    // Add border
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

    // Convert canvas to data URL and trigger download
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "state-vector.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
      {/* Measurement Probability Chart - upper left quarter (25%) */}
      <Card className="col-span-1 row-span-1">
        <CardHeader className="pb-1">
          <div className="flex items-center justify-between">
            <CardTitle>Measurement Probabilities</CardTitle>
            <button
              onClick={downloadProbabilityChart}
              className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Download chart"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="probability-chart">
            <ProbabilityChart
              probabilities={results.measurementProbabilities}
            />
          </div>
        </CardContent>
      </Card>

      {/* Qubit States - entire right half (50%) */}
      <Card className="col-span-1 row-span-2">
        <CardHeader className="pb-2">
          <CardTitle>Qubit States</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Tabs defaultValue="qubit0" className="w-full h-full">
            <TabsList className="w-full grid grid-flow-col auto-cols-fr">
              {results.qubitStates.map((_, i) => (
                <TabsTrigger key={i} value={`qubit${i}`}>
                  Qubit {i}
                </TabsTrigger>
              ))}
            </TabsList>

            {results.qubitStates.map((qubitState, i) => (
              <TabsContent key={i} value={`qubit${i}`} className="h-full">
                <div className="grid grid-rows-6 grid-cols-2 gap-2 h-full">
                  {/* Bloch Sphere Visualization - Increased to 5/6 of height */}
                  <div className="row-span-5 col-span-2">
                    <div className="h-full">
                      <BlochSphereVisualization
                        coordinates={qubitState.blochSphereCoords}
                      />
                    </div>
                  </div>

                  {/* State Representation - bottom left */}
                  <div className="row-span-1 col-span-1">
                    <h4 className="font-medium mb-1">State Representation</h4>
                    <div className="font-mono text-sm">
                      <p>
                        |0⟩: {qubitState.stateVector[0].re.toFixed(4)} +{" "}
                        {qubitState.stateVector[0].im.toFixed(4)}i
                      </p>
                      <p>
                        |1⟩: {qubitState.stateVector[1].re.toFixed(4)} +{" "}
                        {qubitState.stateVector[1].im.toFixed(4)}i
                      </p>
                    </div>
                  </div>

                  {/* Probabilities - bottom right */}
                  <div className="row-span-1 col-span-1">
                    <h4 className="font-medium mb-1">Probabilities</h4>
                    <div className="font-mono text-sm">
                      <p>
                        P(|0⟩): {(qubitState.probability[0] * 100).toFixed(2)}%
                      </p>
                      <p>
                        P(|1⟩): {(qubitState.probability[1] * 100).toFixed(2)}%
                      </p>
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
          <div className="flex items-center justify-between">
            <CardTitle>State Vector</CardTitle>
            <button
              onClick={downloadStateVector}
              className="p-1 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              title="Download state vector"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] overflow-auto state-vector-display">
            <StateVectorDisplay stateVector={results.stateVector} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
