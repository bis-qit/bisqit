import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { saveUserCircuit } from '@/lib/api';
import { Circuit, Qubit } from '@/lib/types';
import { toast } from 'react-hot-toast';

interface CircuitEditorProps {
  circuit: Circuit;
  qubits: Qubit[];
  onCircuitChange: (circuit: Circuit) => void;
  onQubitsChange: (qubits: Qubit[]) => void;
}

export default function CircuitEditor({
  circuit,
  qubits,
  onCircuitChange,
  onQubitsChange
}: CircuitEditorProps) {
  const { isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveCircuit = async () => {
    if (!isAuthenticated) {
      toast.error('You must be logged in to save circuits');
      return;
    }

    try {
      setIsSaving(true);
      await saveUserCircuit(circuit, qubits);
      toast.success('Circuit saved successfully');
    } catch (error) {
      console.error('Failed to save circuit:', error);
      toast.error('Failed to save circuit');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Existing circuit editor UI */}
      
      {/* Add save button */}
      {isAuthenticated && (
        <button
          onClick={handleSaveCircuit}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSaving ? 'Saving...' : 'Save Circuit'}
        </button>
      )}
      
      {/* Rest of your circuit editor */}
    </div>
  );
}
