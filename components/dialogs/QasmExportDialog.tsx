"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface QasmExportDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  qasmCode: string;
}

export default function QasmExportDialog({
  isOpen,
  setIsOpen,
  qasmCode,
}: QasmExportDialogProps) {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qasmCode);
      toast.success("Copied to clipboard", {
        description: "QASM code has been copied to your clipboard",
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy to clipboard",
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([qasmCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quantum_circuit.qasm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Downloaded", {
      description: "QASM file has been downloaded",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export QASM Code</DialogTitle>
          <DialogDescription>
            Below is the generated OpenQASM 2.0 code for your quantum circuit.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <pre className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto max-h-[400px] text-sm font-mono">
            {qasmCode}
          </pre>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCopyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
            <Button onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}