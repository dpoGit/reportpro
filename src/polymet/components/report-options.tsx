import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { RefreshCwIcon } from "lucide-react";
import { ReportSettings } from "@/polymet/data/site-audit-data";

interface ReportOptionsProps {
  onSave?: (options: ReportSettings) => void;
  onCancel?: () => void;
  onRegenerate?: () => void;
}

const defaultOptions: ReportSettings = {
  includePhotos: true,
  includeFrontCover: true,
  includeTimestamps: true,
  includePageNumbers: true,
  theme: "bright",
  photoSize: "regular",
  textSize: "regular",
  photoQuality: 70,
  includeImagesInCSV: true,
};

export default function ReportOptions({
  onSave,
  onCancel,
  onRegenerate,
}: ReportOptionsProps) {
  const [options, setOptions] = useState<ReportSettings>(defaultOptions);

  const handleToggleChange = (key: keyof ReportSettings) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectChange = (value: string, key: keyof ReportSettings) => {
    setOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSliderChange = (value: number[]) => {
    setOptions((prev) => ({
      ...prev,
      photoQuality: value[0],
    }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(options);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        {/* The "Report Options" title will be handled by DialogTitle in the parent component */}
        <Button variant="outline" size="sm" onClick={onRegenerate}>
          <RefreshCwIcon className="h-4 w-4 mr-1" />
          Regenerate
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            INCLUDE ON REPORT
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-photos" className="flex-1">
                Photos
              </Label>
              <Switch
                id="include-photos"
                checked={options.includePhotos}
                onCheckedChange={() => handleToggleChange("includePhotos")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-front-cover" className="flex-1">
                Front Cover
              </Label>
              <Switch
                id="include-front-cover"
                checked={options.includeFrontCover}
                onCheckedChange={() => handleToggleChange("includeFrontCover")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-timestamps" className="flex-1">
                Timestamps
              </Label>
              <Switch
                id="include-timestamps"
                checked={options.includeTimestamps}
                onCheckedChange={() => handleToggleChange("includeTimestamps")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="include-page-numbers" className="flex-1">
                Page Numbers
              </Label>
              <Switch
                id="include-page-numbers"
                checked={options.includePageNumbers}
                onCheckedChange={() => handleToggleChange("includePageNumbers")}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            APPEARANCE
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme" className="flex-1">
                Theme
              </Label>
              <Select
                value={options.theme}
                onValueChange={(value) => handleSelectChange(value, "theme")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bright">Bright</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="photo-size" className="flex-1">
                Photo Size
              </Label>
              <Select
                value={options.photoSize}
                onValueChange={(value) =>
                  handleSelectChange(value, "photoSize")
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="text-size" className="flex-1">
                Text Size
              </Label>
              <Select
                value={options.textSize}
                onValueChange={(value) => handleSelectChange(value, "textSize")}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            PHOTO QUALITY
          </h3>
          <Slider
            defaultValue={[options.photoQuality]}
            max={100}
            step={10}
            onValueChange={handleSliderChange}
            className="my-6"
          />

          <p className="text-xs text-muted-foreground">
            Increasing the photo quality will result in larger report file
            sizes.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            CSV OPTIONS
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-images-csv" className="flex-1">
                Include Images in Export
              </Label>
              <Switch
                id="include-images-csv"
                checked={options.includeImagesInCSV}
                onCheckedChange={() => handleToggleChange("includeImagesInCSV")}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            If you include images in the CSV Export, the resulting .zip file
            will be too large to share using email.
          </p>
        </div>
      </div>

      <div className="border-t p-4">
        <Button className="w-full" onClick={handleSave}>
          Apply Settings
        </Button>
      </div>
    </div>
  );
}
