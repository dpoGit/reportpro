import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrashIcon } from "lucide-react";

interface SignaturePadProps {
  onSave?: (signature: {
    image: string;
    name: string;
    company: string;
  }) => void;
  initialName?: string;
  initialCompany?: string;
}

export default function SignaturePad({
  onSave,
  initialName = "",
  initialCompany = "",
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    // Set drawing styles
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#000";
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setHasSignature(true);

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    let x, y;

    if ("touches" in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();

    let x, y;

    if ("touches" in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const saveSignature = () => {
    if (!hasSignature || !canvasRef.current) return;

    const signatureImage = canvasRef.current.toDataURL("image/png");

    if (onSave) {
      onSave({
        image: signatureImage,
        name,
        company,
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md rounded-md border border-dashed border-gray-300 bg-white dark:bg-gray-800 p-4">
          <canvas
            ref={canvasRef}
            className="w-full h-40 touch-none cursor-crosshair bg-white dark:bg-gray-800"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={clearSignature}
        >
          <TrashIcon className="h-4 w-4 mr-1" />
          Clear Signature
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="auditor-name">Auditor Name</Label>
          <Input
            id="auditor-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="auditor-company">Auditor Company</Label>
          <Input
            id="auditor-company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter your company name"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          Auditor Name and Company can be entered in Settings and will populate
          these fields for new projects. Editing here will only affect this
          project.
        </p>
      </div>

      <Button
        className="w-full bg-blue-500 hover:bg-blue-600"
        disabled={!hasSignature || !name}
        onClick={saveSignature}
      >
        Save Signature
      </Button>
    </div>
  );
}
