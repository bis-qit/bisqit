import CircuitDesigner from "@/components/circuit/CircuitDesigner";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <div className="w-[95vw] mx-auto px-1 sm:px-2">
        <h1 className="mt-6 mb-6 text-3xl text-center font-bold">Quantum Circuit Simulator</h1>
        <CircuitDesigner />
      </div>
    </main>
  );
}
