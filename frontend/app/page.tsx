"use client";

import { useEffect, useState } from 'react';
import { loadUserCircuit } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Circuit, Qubit } from '@/lib/types';
import CircuitDesigner from "@/components/circuit/CircuitDesigner";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";

// Define a circuit context or state management solution here
// Assuming you have a setCircuit function that sets the current circuit
// For example, through React Context or a state management library

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [savedCircuit, setSavedCircuit] = useState<{ circuit: Circuit, qubits: Qubit[] } | null>(null);

  useEffect(() => {
    const fetchSavedCircuit = async () => {
      if (isAuthenticated) {
        try {
          const circuitData = await loadUserCircuit();
          console.log("Saved circuit data:", circuitData);

          // Store the circuit data in state instead of redirecting
          if (circuitData && circuitData.circuit && circuitData.qubits) {
            setSavedCircuit(circuitData);
          }

          // In any case, we're done loading
          setIsLoading(false);
        } catch (error) {
          console.error("Error loading saved circuit:", error);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchSavedCircuit();
  }, [isAuthenticated]);

// Your homepage content
  return (
    <main className="flex flex-col w-full" style={{ backgroundColor: "#E6E6FA" }}> 
      <Header />
      <div className="w-[95vw] mx-auto px-1 sm:px-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
              <h1 className="mt-6 mb-6 text-3xl text-center font-bold">Welcome to BisQit</h1>
            <CircuitDesigner
              initialCircuit={savedCircuit?.circuit}
              initialQubits={savedCircuit?.qubits}
            />
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
