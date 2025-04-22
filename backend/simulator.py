from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer
from qiskit.quantum_info import Statevector
from qiskit.visualization import plot_bloch_multivector
import numpy as np
import logging
from typing import List, Dict, Optional
import traceback

from models import Gate, Complex, BlochSphereCoordinates, QubitState, SimulationResults

# Configure logging
logger = logging.getLogger("bisqit.simulator")


def simulate_circuit(gates: List[Gate], qubit_count: int, shots: int = 1024, qasm_code: str = None) -> SimulationResults:
    """
    Simulates a quantum circuit using Qiskit.

    Args:
        gates: List of quantum gates to be applied
        qubit_count: Number of qubits in the circuit
        shots: Number of simulation shots for measurement
        qasm_code: Optional QASM code to use instead of gates

    Returns:
        SimulationResults: The results of the simulation
    """
    try:
        logger.info(f"Starting simulation with {qubit_count} qubits")

        # Create a quantum circuit
        if qasm_code:
            logger.info("Using provided QASM code")
            try:
                qc = QuantumCircuit.from_qasm_str(qasm_code)
                qubit_count = qc.num_qubits
            except Exception as e:
                logger.error(f"Error parsing QASM code: {str(e)}")
                raise ValueError(f"Invalid QASM code: {str(e)}")
        else:
            logger.info(f"Building circuit from {len(gates)} gates")
            qc = QuantumCircuit(qubit_count)

            # Sort gates by position to ensure correct execution order
            sorted_gates = sorted(gates, key=lambda g: g.position)

            for gate in sorted_gates:
                try:
                    add_gate_to_circuit(qc, gate)
                except Exception as e:
                    logger.error(f"Error adding gate {gate.type}: {str(e)}")
                    raise ValueError(
                        f"Error adding gate {gate.type} at position {gate.position}: {str(e)}")

        # Run the simulation
        try:
            logger.info("Executing statevector simulation")
            simulator = Aer.get_backend('statevector_simulator')
            # Remove this line which causes the duplicate key error
            # qc.save_statevector()
            
            # Use transpiled circuit and run with correct configuration
            transpiled_qc = transpile(qc, simulator)
            result = simulator.run(transpiled_qc).result()
            statevector = result.get_statevector()

            if statevector is None:
                raise ValueError("Simulation produced no statevector result")

            logger.info("Simulation completed successfully")
        except Exception as e:
            logger.error(f"Simulation execution failed: {str(e)}")
            raise RuntimeError(f"Simulation execution failed: {str(e)}")

        # Process results
        return process_simulation_results(statevector, qubit_count)

    except Exception as e:
        logger.error(f"Error simulating circuit: {str(e)}")
        logger.debug(traceback.format_exc())
        raise e


def add_gate_to_circuit(circuit: QuantumCircuit, gate: Gate):
    """Add a gate to the quantum circuit."""
    gate_type = gate.type.lower()
    qubits = gate.qubitIndices

    # Validate qubits
    for q in qubits:
        if q < 0 or q >= circuit.num_qubits:
            raise ValueError(f"Invalid qubit index: {q}")

    # Add gate to circuit based on type
    try:
        if gate_type == "h":
            circuit.h(qubits[0])
        elif gate_type == "x":
            circuit.x(qubits[0])
        elif gate_type == "y":
            circuit.y(qubits[0])
        elif gate_type == "z":
            circuit.z(qubits[0])
        elif gate_type == "s":
            circuit.s(qubits[0])
        elif gate_type == "t":
            circuit.t(qubits[0])
        elif gate_type == "cx":
            if len(qubits) != 2:
                raise ValueError(
                    f"CNOT gate requires exactly 2 qubits, got {len(qubits)}")
            circuit.cx(qubits[0], qubits[1])
        elif gate_type == "swap":
            if len(qubits) != 2:
                raise ValueError(
                    f"SWAP gate requires exactly 2 qubits, got {len(qubits)}")
            circuit.swap(qubits[0], qubits[1])
        elif gate_type == "ccx":
            if len(qubits) != 3:
                raise ValueError(
                    f"Toffoli gate requires exactly 3 qubits, got {len(qubits)}")
            circuit.ccx(qubits[0], qubits[1], qubits[2])
        elif gate_type == "cswap":
            if len(qubits) != 3:
                raise ValueError(
                    f"Fredkin gate requires exactly 3 qubits, got {len(qubits)}")
            circuit.cswap(qubits[0], qubits[1], qubits[2])
        elif gate_type == "rx":
            theta = gate.parameters.theta if gate.parameters and gate.parameters.theta is not None else 0
            circuit.rx(theta, qubits[0])
        elif gate_type == "ry":
            theta = gate.parameters.theta if gate.parameters and gate.parameters.theta is not None else 0
            circuit.ry(theta, qubits[0])
        elif gate_type == "rz":
            theta = gate.parameters.theta if gate.parameters and gate.parameters.theta is not None else 0
            circuit.rz(theta, qubits[0])
        else:
            raise ValueError(f"Unsupported gate type: {gate_type}")
    except Exception as e:
        if isinstance(e, ValueError) and "Unsupported gate type" in str(e):
            raise e
        else:
            raise ValueError(f"Error applying {gate_type} gate: {str(e)}")


def process_simulation_results(statevector, qubit_count: int) -> SimulationResults:
    """Process the simulation results to create a SimulationResults object."""
    try:
        # Calculate measurement probabilities
        measurement_probabilities = {}
        state_vector_complex = []

        # Process statevector
        for i, amplitude in enumerate(statevector):
            binary = format(i, f'0{qubit_count}b')
            probability = abs(amplitude)**2

            if probability > 1e-10:  # Ignore very small probabilities
                measurement_probabilities[binary] = float(probability)

            # Convert complex numbers for response
            state_vector_complex.append(Complex(
                re=float(amplitude.real),
                im=float(amplitude.imag),
                magnitude=float(abs(amplitude)),
                phase=float(np.angle(amplitude))
            ))

        # Calculate individual qubit states
        qubit_states = []
        for q in range(qubit_count):
            qubit_state = calculate_qubit_state(statevector, q, qubit_count)
            qubit_states.append(qubit_state)

        return SimulationResults(
            qubitStates=qubit_states,
            measurementProbabilities=measurement_probabilities,
            stateVector=state_vector_complex
        )
    except Exception as e:
        logger.error(f"Error processing simulation results: {str(e)}")
        raise RuntimeError(f"Error processing simulation results: {str(e)}")


def calculate_qubit_state(statevector, qubit_index: int, qubit_count: int) -> QubitState:
    """Calculate the state of a single qubit."""
    try:
        # Calculate reduced density matrix for the qubit
        rho = np.zeros((2, 2), dtype=complex)

        for i in range(2**qubit_count):
            i_binary = format(i, f'0{qubit_count}b')
            # Note: qubits ordered from right to left
            i_bit = int(i_binary[-(qubit_index+1)])

            for j in range(2**qubit_count):
                j_binary = format(j, f'0{qubit_count}b')
                j_bit = int(j_binary[-(qubit_index+1)])

                # Check if all other bits match
                if all(i_binary[-(k+1)] == j_binary[-(k+1)] for k in range(qubit_count) if k != qubit_index):
                    rho[i_bit, j_bit] += statevector[i] * \
                        np.conj(statevector[j])

        # Calculate Bloch sphere coordinates
        x = 2 * np.real(rho[0, 1])
        y = 2 * np.imag(rho[1, 0])
        z = np.real(rho[0, 0] - rho[1, 1])

        # Calculate probabilities for |0⟩ and |1⟩
        prob_0 = float(np.real(rho[0, 0]))
        prob_1 = float(np.real(rho[1, 1]))

        # Create qubit state vector
        alpha = np.sqrt(prob_0)
        beta = np.sqrt(prob_1) * np.exp(1j * np.arctan2(y, x)
                                        ) if prob_1 > 0 else 0j

        # Ensure finite values (handle potential numerical issues)
        def ensure_finite(val):
            if np.isnan(val) or np.isinf(val):
                return 0.0
            return float(val)

        state_vector = [
            Complex(
                re=ensure_finite(np.real(alpha)),
                im=ensure_finite(np.imag(alpha)),
                magnitude=ensure_finite(abs(alpha)),
                phase=ensure_finite(np.angle(alpha))
            ),
            Complex(
                re=ensure_finite(np.real(beta)),
                im=ensure_finite(np.imag(beta)),
                magnitude=ensure_finite(abs(beta)),
                phase=ensure_finite(np.angle(beta))
            )
        ]

        return QubitState(
            stateVector=state_vector,
            probability=[prob_0, prob_1],
            blochSphereCoords=BlochSphereCoordinates(
                x=ensure_finite(x),
                y=ensure_finite(y),
                z=ensure_finite(z)
            )
        )
    except Exception as e:
        logger.error(
            f"Error calculating qubit state for qubit {qubit_index}: {str(e)}")
        # Return a default state in case of error
        return QubitState(
            stateVector=[
                Complex(re=1.0, im=0.0, magnitude=1.0, phase=0.0),
                Complex(re=0.0, im=0.0, magnitude=0.0, phase=0.0)
            ],
            probability=[1.0, 0.0],
            blochSphereCoords=BlochSphereCoordinates(x=0.0, y=0.0, z=1.0)
        )
