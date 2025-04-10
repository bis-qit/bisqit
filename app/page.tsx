import CircuitDesigner from "@/components/circuit/CircuitDesigner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto px-4">
        <h1 className="mt-4 mb-4 text-3xl text-center font-bold">Quantum Circuit Simulator</h1>
        <CircuitDesigner />
      </div>
    </main>
  );
}
