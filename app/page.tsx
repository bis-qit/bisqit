import CircuitDesigner from "@/components/circuit/CircuitDesigner";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="flex flex-col w-full" style={{ backgroundColor: "#E6E6FA" }}> 
      <Header />
      <div className="w-[95vw] mx-auto px-1 sm:px-2">
        <h1 className="mt-6 mb-6 text-3xl text-center font-bold">Quantum Circuit Simulator</h1>
        <CircuitDesigner />
      </div>
      <Footer />
    </main>
  );
}
