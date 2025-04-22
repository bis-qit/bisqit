import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface ParameterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (theta: number) => void;
  gateName: string;
}

export default function ParameterDialog({
  isOpen,
  onClose,
  onConfirm,
  gateName,
}: ParameterDialogProps) {
  const [theta, setTheta] = useState<string>("0");

  const handleSubmit = () => {
    const value = parseFloat(theta);
    if (!isNaN(value)) {
      onConfirm(value);
      setTheta("0"); // Reset for next time
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set {gateName} Parameters</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="theta" className="text-right">
              θ (radians)
            </Label>
            <Input
              id="theta"
              type="number"
              step="0.1"
              value={theta}
              onChange={(e) => setTheta(e.target.value)}
              className="col-span-3"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}