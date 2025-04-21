"use client";

import { Complex } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StateVectorDisplayProps {
  stateVector: Complex[];
}

export default function StateVectorDisplay({
  stateVector,
}: StateVectorDisplayProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>State</TableHead>
          <TableHead>Real</TableHead>
          <TableHead>Imaginary</TableHead>
          <TableHead>Magnitude</TableHead>
          <TableHead>Phase</TableHead>
          <TableHead>Probability</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stateVector.map((state, index) => {
          const binaryIndex = index
            .toString(2)
            .padStart(Math.log2(stateVector.length), "0");
          const probability = state.magnitude * state.magnitude;

          return (
            <TableRow key={index}>
              <TableCell className="font-mono">|{binaryIndex}⟩</TableCell>
              <TableCell className="font-mono">{state.re.toFixed(4)}</TableCell>
              <TableCell className="font-mono">{state.im.toFixed(4)}</TableCell>
              <TableCell className="font-mono">
                {state.magnitude.toFixed(4)}
              </TableCell>
              <TableCell className="font-mono">
                {((state.phase * 180) / Math.PI).toFixed(1)}°
              </TableCell>
              <TableCell
                className={`font-mono ${probability > 0.01 ? "font-bold" : ""}`}
              >
                {(probability * 100).toFixed(2)}%
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
