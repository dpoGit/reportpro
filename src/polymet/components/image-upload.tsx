import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, UploadIcon, XIcon, RefreshCwIcon } from "lucide-react";

interface ImageUploadProps {
  initialImage?: string;
  onImageChange?: (imageData: string | null) => void;
  className?: string;
  aspectRatio?: "square" | "wide" | "tall";
  maxSizeMB?: number;
}

export default function ImageUpload({
  initialImage,
  onImageChange,
  className = "",
  aspectRatio = "wide",
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(initialImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClass = {
    square: "aspect-square",
    wide: "aspect-video",
    tall: "aspect-[3/4]",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setImage(imageData);
      if (onImageChange) {
        onImageChange(imageData);
      }
      setIsLoading(false);
    };

    reader.onerror = () => {
      setError("Failed to read file");
      setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageChange) {
      onImageChange(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload image"
      />

      {image ? (
        <div className="relative">
          <img
            src={image}
            alt="Uploaded image"
            className={`w-full object-cover rounded-md ${aspectRatioClass[aspectRatio]}`}
          />

          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onClick={triggerFileInput}
            >
              <RefreshCwIcon className="h-4 w-4" />

              <span className="sr-only">Replace image</span>
            </Button>
            <Button
              size="icon"
              variant="destructive"
              className="h-8 w-8 bg-destructive/80 backdrop-blur-sm hover:bg-destructive/90"
              onClick={handleRemoveImage}
            >
              <XIcon className="h-4 w-4" />

              <span className="sr-only">Remove image</span>
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className={`border-2 border-dashed border-muted-foreground/25 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/40 transition-colors ${aspectRatioClass[aspectRatio]}`}
        >
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />

            <p className="text-sm font-medium mb-1">
              Click to upload project image
            </p>
            <p className="text-xs text-muted-foreground">
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
            {error && (
              <p className="text-xs text-destructive mt-2 font-medium">
                {error}
              </p>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={triggerFileInput}
            >
              <UploadIcon className="h-4 w-4 mr-2" />
              Select Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
