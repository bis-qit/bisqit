"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Metadata } from "next";

export default function HelpPage() {
  return (
    <main className="flex flex-col w-full min-h-[calc(100vh-64px)]" style={{ backgroundColor: "#E6E6FA" }}>
      <div className="container mx-auto px-4 py-8">
        {/* Page header with enhanced styling */}
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-[#A37CF0]">Help</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Learn how to use the quantum circuit simulator and build your quantum programs
          </p>
        </div>

        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="mb-4 w-full justify-start bg-white/50 p-1 rounded-lg">
            <TabsTrigger 
              value="basics" 
              className="data-[state=active]:bg-[#A37CF0] data-[state=active]:text-white"
            >
              Basics
            </TabsTrigger>
            <TabsTrigger 
              value="gates" 
              className="data-[state=active]:bg-[#A37CF0] data-[state=active]:text-white"
            >
              Quantum Gates
            </TabsTrigger>
            <TabsTrigger 
              value="simulation" 
              className="data-[state=active]:bg-[#A37CF0] data-[state=active]:text-white"
            >
              Simulation
            </TabsTrigger>
            <TabsTrigger 
              value="concepts" 
              className="data-[state=active]:bg-[#A37CF0] data-[state=active]:text-white"
            >
              Quantum Concepts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Getting Started</CardTitle>
                <CardDescription className="text-gray-600">
                  Learn the basics of quantum circuit design
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-3 pb-4 bg-white/90 rounded-b-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Interface Overview</h3>
                  <p className="text-gray-600">
                    The circuit designer interface consists of a gate palette on the left, a circuit grid in the center, 
                    and circuit controls on the right. Drag gates from the palette onto the grid to create your quantum circuit.
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Adding and Removing Qubits</h3>
                  <p className="text-gray-600">
                    Use the "Add Qubit" and "Remove Qubit" buttons in the circuit controls panel to adjust the number of qubits in your circuit.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Classical vs Quantum Computing</CardTitle>
                <CardDescription className="text-gray-600">
                  Understanding the fundamental differences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-3 pb-4 bg-white/90 rounded-b-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Classical Computing</h3>
                  <p className="text-gray-600">
                    Classical computers employ bits, which are either 0 or 1. All classical computation relies on altering these binary values with logical operations.
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Quantum Computing</h3>
                  <p className="text-gray-600">
                    Quantum computers employ quantum bits or qubits. Qubits are different from traditional bits in that they can exist in multiple states simultaneously due to the laws of quantum mechanics. This enables quantum computers to compute certain kinds of problems much more quickly than classical computers.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gates" className="space-y-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Single-Qubit Gates</CardTitle>
                <CardDescription className="text-gray-600">
                  Gates that operate on individual qubits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-3 pb-4 bg-white/90 rounded-b-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Pauli-X (NOT) Gate</h3>
                  <p className="text-gray-600 mb-0.5">
                    The quantum equivalent of the classical NOT gate. It flips the state of a qubit.
                  </p>
                  <p className="text-gray-600">
                    <strong>Action:</strong> |0⟩ → |1⟩ and |1⟩ → |0⟩
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Pauli-Y Gate</h3>
                  <p className="text-gray-600 mb-0.5">
                    Rotates the qubit state around the Y-axis of the Bloch sphere.
                  </p>
                  <p className="text-gray-600">
                    <strong>Action:</strong> |0⟩ → i|1⟩ and |1⟩ → -i|0⟩
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Pauli-Z Gate</h3>
                  <p className="text-gray-600 mb-0.5">
                    Flips the phase of the |1⟩ state.
                  </p>
                  <p className="text-gray-600">
                    <strong>Action:</strong> |0⟩ → |0⟩ and |1⟩ → -|1⟩
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Hadamard (H) Gate</h3>
                  <p className="text-gray-600 mb-0.5">
                    Produces superposition. One of the most significant gates in quantum computing.
                  </p>
                  <p className="text-gray-600">
                    <strong>Action:</strong> |0⟩ → (|0⟩ + |1⟩)/√2 and |1⟩ → (|0⟩ - |1⟩)/√2
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Phase Gates (S, T)</h3>
                  <p className="text-gray-600 mb-0.5">
                    Cause phase shifts in quantum states.
                  </p>
                  <p className="text-gray-600 mb-0.5">
                    <strong>S Gate:</strong> Applies a 90° phase shift (π/2)
                  </p>
                  <p className="text-gray-600">
                    <strong>T Gate:</strong> Applies a 45° phase shift (π/4)
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Multi-Qubit Gates</CardTitle>
                <CardDescription className="text-gray-600">
                  Gates that operate on multiple qubits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-3 pb-4 bg-white/90 rounded-b-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Controlled-NOT (CNOT) Gate</h3>
                  <p className="text-gray-600 mb-0.5">
                    A 2-qubit gate that flips the target qubit if the control qubit is |1⟩.
                  </p>
                  <p className="text-gray-600">
                    <strong>Action:</strong> |00⟩ → |00⟩, |01⟩ → |01⟩, |10⟩ → |11⟩, |11⟩ → |10⟩
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">SWAP Gate</h3>
                  <p className="text-gray-600">
                    Swaps the states of two qubits.
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Toffoli (CCNOT) Gate</h3>
                  <p className="text-gray-600">
                    A three-qubit gate which performs a NOT operation on the third qubit if both control qubits are in state |1⟩.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Running Simulations</CardTitle>
                <CardDescription className="text-gray-600">
                  How to run and interpret quantum simulations
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 pb-4 bg-white/90 rounded-b-lg">
                <p className="text-gray-600">
                  After building your circuit, click the "Run Simulation" button to execute the quantum simulation.
                  Results will be displayed in the Simulation Results tab, showing state probabilities and measurement outcomes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Quantum Measurement</CardTitle>
                <CardDescription className="text-gray-600">
                  Understanding measurement in quantum systems
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 pb-4 bg-white/90 rounded-b-lg">
                <p className="text-gray-600 mb-1">
                  In quantum computation, measurement differs from classical computing fundamentally:
                </p>
                <ul className="list-disc pl-6 space-y-0.5 text-gray-600">
                  <li>Measurement causes the collapse of the quantum state to one of the basis states</li>
                  <li>Outcome is probabilistic according to squared amplitudes</li>
                  <li>Measurement is irreversible—superposition is lost once measured</li>
                  <li>The specific basis used for measurement affects the outcome</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="concepts" className="space-y-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">The Qubit</CardTitle>
                <CardDescription className="text-gray-600">
                  The fundamental unit of quantum information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-3 pb-4 bg-white/90 rounded-b-lg">
                <p className="text-gray-600">
                  A qubit is the quantum information unit. A classical bit is either 0 or 1 at all times, but a qubit can be in a superposition of both states at the same time. We denote the state of a qubit as follows:
                </p>
                <p className="text-gray-800 font-medium text-center my-1">
                  |ψ⟩ = α|0⟩ + β|1⟩
                </p>
                <p className="text-gray-600 mb-0.5">
                  Where:
                </p>
                <ul className="list-disc pl-6 space-y-0.5 text-gray-600">
                  <li>|ψ⟩ is the quantum state</li>
                  <li>α and β are complex numbers</li>
                  <li>|α|² is the probability of finding the qubit to be 0</li>
                  <li>|β|² is the probability of measuring the qubit to be 1</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Superposition</CardTitle>
                <CardDescription className="text-gray-600">
                  Qubits existing in multiple states simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 pb-4 bg-white/90 rounded-b-lg">
                <p className="text-gray-600">
                  Superposition enables a qubit to have many states at once. When we observe a qubit in superposition, quantum mechanics predicts that it "collapses" to the |0⟩ or |1⟩ state with probability given by its amplitudes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Entanglement</CardTitle>
                <CardDescription className="text-gray-600">
                  Quantum correlation between qubits
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-3 pb-4 bg-white/90 rounded-b-lg">
                <p className="text-gray-600 mb-1">
                  Entanglement is a quantum phenomenon whereby two or more qubits become correlated such that the quantum state of one qubit cannot be accounted for independently of the others. Entangled qubits have their state determined if one of them is measured, regardless of the distance between them.
                </p>
                <p className="text-gray-600 mb-0.5">
                  The Bell state is a simple demonstration of entanglement:
                </p>
                <p className="text-gray-800 font-medium text-center my-1">
                  |ψ⟩ = (|00⟩ + |11⟩)/√2
                </p>
                <p className="text-gray-600">
                  In this state, it is possible to measure the first qubit directly and be aware of the state of the second qubit, although they are separated in space.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-white/80 rounded-t-lg border-b border-gray-100 py-3">
                <CardTitle className="text-xl text-[#A37CF0]">Deutsch-Jozsa Algorithm</CardTitle>
                <CardDescription className="text-gray-600">
                  A basic quantum algorithm demonstrating quantum advantage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1 pt-3 pb-4 bg-white/90 rounded-b-lg">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Problem Statement</h3>
                  <p className="text-gray-600">
                    Given a black-box function that is either constant (returns the same output for all inputs) or balanced (returns 0 for half the inputs and 1 for the other half), determine which type it is.
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Classical Solution</h3>
                  <p className="text-gray-600">
                    In the worst case, check (N/2)+1 inputs to be certain.
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Quantum Solution</h3>
                  <p className="text-gray-600">
                    Just 1 evaluation of the function using superposition.
                  </p>
                </div>
                <div className="mt-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-0.5">Algorithm Steps</h3>
                  <ol className="list-decimal pl-6 space-y-0.5 text-gray-600">
                    <li>Set up n+1 qubits to |0...01⟩</li>
                    <li>Put Hadamard gates on all qubits, putting all input possibilities in superposition</li>
                    <li>Apply the function as a quantum operation</li>
                    <li>Put Hadamard gates on the first n qubits</li>
                    <li>Measure the first n qubits</li>
                    <li>If all of the measured qubits are 0, then the function is constant; otherwise, it's balanced</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Footer with dark purple color */}
      <footer className="w-full py-4 mt-auto shadow-sm" style={{ backgroundColor: "#A37CF0" }}>
        <div className="container mx-auto px-4 flex items-center justify-center">
          <p className="text-sm text-center text-white">
            &copy; {new Date().getFullYear()} BisQit - Quantum Circuit Simulator
          </p>
        </div>
      </footer>
    </main>
  );
}