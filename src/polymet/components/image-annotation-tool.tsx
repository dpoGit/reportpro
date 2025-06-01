import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  PencilIcon,
  UndoIcon,
  ArrowLeftIcon,
  TrashIcon,
  SquareIcon,
  CircleIcon,
  ArrowRightIcon,
  SaveIcon,
} from "lucide-react";

interface ImageAnnotationToolProps {
  imageUrl: string;
  onSave?: (annotatedImageData: string) => void;
  onCancel?: () => void;
}

type Tool = "pen" | "arrow" | "rectangle" | "circle" | "eraser";
type DrawingPoint = { x: number; y: number; tool: Tool; color: string };
type DrawingStroke = DrawingPoint[];

export default function ImageAnnotationTool({
  imageUrl,
  onSave,
  onCancel,
}: ImageAnnotationToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<Tool>("pen");
  const [currentColor, setCurrentColor] = useState("#FF0000");
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<DrawingStroke>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const colors = [
    "#FF0000", // Red
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFFFF", // White
    "#000000", // Black
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw image on canvas
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      setImageLoaded(true);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas and redraw image
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageUrl;
    image.onload = () => {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Redraw all strokes
      strokes.forEach((stroke) => {
        drawStroke(ctx, stroke);
      });

      // Draw current stroke
      if (currentStroke.length > 0) {
        drawStroke(ctx, currentStroke);
      }
    };
  }, [strokes, currentStroke, imageLoaded]);

  const drawStroke = (ctx: CanvasRenderingContext2D, stroke: DrawingStroke) => {
    if (stroke.length === 0) return;

    const firstPoint = stroke[0];
    ctx.strokeStyle = firstPoint.color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    if (firstPoint.tool === "pen" || firstPoint.tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(firstPoint.x, firstPoint.y);

      for (let i = 1; i < stroke.length; i++) {
        const point = stroke[i];
        ctx.lineTo(point.x, point.y);
      }

      if (firstPoint.tool === "eraser") {
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 10;
      }

      ctx.stroke();
    } else if (firstPoint.tool === "arrow" && stroke.length > 1) {
      const lastPoint = stroke[stroke.length - 1];
      drawArrow(
        ctx,
        firstPoint.x,
        firstPoint.y,
        lastPoint.x,
        lastPoint.y,
        firstPoint.color
      );
    } else if (firstPoint.tool === "rectangle" && stroke.length > 1) {
      const lastPoint = stroke[stroke.length - 1];
      const width = lastPoint.x - firstPoint.x;
      const height = lastPoint.y - firstPoint.y;

      ctx.beginPath();
      ctx.rect(firstPoint.x, firstPoint.y, width, height);
      ctx.stroke();
    } else if (firstPoint.tool === "circle" && stroke.length > 1) {
      const lastPoint = stroke[stroke.length - 1];
      const radius = Math.sqrt(
        Math.pow(lastPoint.x - firstPoint.x, 2) +
          Math.pow(lastPoint.y - firstPoint.y, 2)
      );

      ctx.beginPath();
      ctx.arc(firstPoint.x, firstPoint.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string
  ) => {
    const headLength = 15;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw the arrow head
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setStartPoint({ x, y });

    const newPoint: DrawingPoint = {
      x,
      y,
      tool: currentTool,
      color: currentColor,
    };

    setCurrentStroke([newPoint]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPoint) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (currentTool === "pen" || currentTool === "eraser") {
      const newPoint: DrawingPoint = {
        x,
        y,
        tool: currentTool,
        color: currentColor,
      };

      setCurrentStroke((prev) => [...prev, newPoint]);
    } else {
      // For shapes, we only need the start and current point
      setCurrentStroke([
        {
          x: startPoint.x,
          y: startPoint.y,
          tool: currentTool,
          color: currentColor,
        },
        {
          x,
          y,
          tool: currentTool,
          color: currentColor,
        },
      ]);
    }
  };

  const handleMouseUp = () => {
    if (currentStroke.length > 0) {
      setStrokes((prev) => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
    setIsDrawing(false);
    setStartPoint(null);
  };

  const handleUndo = () => {
    setStrokes((prev) => prev.slice(0, -1));
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const annotatedImageData = canvas.toDataURL("image/png");
    if (onSave) {
      onSave(annotatedImageData);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-gray-900 p-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Cancel
        </Button>
        <div className="text-center text-sm font-medium">Annotations</div>
        <Button variant="ghost" size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="max-h-full max-w-full object-contain"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-3">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={currentTool === "pen" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentTool("pen")}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "arrow" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentTool("arrow")}
            >
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "rectangle" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentTool("rectangle")}
            >
              <SquareIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "circle" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentTool("circle")}
            >
              <CircleIcon className="h-4 w-4" />
            </Button>
            <Button
              variant={currentTool === "eraser" ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              onClick={() => setCurrentTool("eraser")}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={handleUndo}
              disabled={strokes.length === 0}
            >
              <UndoIcon className="h-4 w-4" />
            </Button>
            <div className="flex space-x-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`h-6 w-6 rounded-full ${
                    currentColor === color ? "ring-2 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurrentColor(color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
