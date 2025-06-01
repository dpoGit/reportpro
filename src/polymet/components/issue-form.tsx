import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";

interface IssueFormProps {
  onSubmit?: (issue: IssueFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<IssueFormData>;
}

export interface IssueFormData {
  title: string;
  assignee: string;
  comments: string;
  images: string[];
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
}

export default function IssueForm({
  onSubmit,
  onCancel,
  initialData,
}: IssueFormProps) {
  const [formData, setFormData] = useState<IssueFormData>({
    title: initialData?.title || "",
    assignee: initialData?.assignee || "",
    comments: initialData?.comments || "",
    images: initialData?.images || [],
    status: initialData?.status || "open",
    priority: initialData?.priority || "medium",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<IssueFormData, "images" | "status" | "priority">
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleSelectChange = (value: string, field: "status" | "priority") => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);

          if (newImages.length === files.length) {
            setFormData({
              ...formData,
              images: [...formData.images, ...newImages],
            });
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Issue Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Enter issue title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  value={formData.assignee}
                  onChange={(e) => handleInputChange(e, "assignee")}
                  placeholder="Enter assignee name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange(value, "status")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleSelectChange(value, "priority")}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                value={formData.comments}
                onChange={(e) => handleInputChange(e, "comments")}
                placeholder="Enter comments or description"
                rows={4}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Images</Label>
              <div className="relative">
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <Label
                  htmlFor="image-upload"
                  className="flex items-center cursor-pointer text-sm text-blue-500 hover:text-blue-600"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Images
                </Label>
              </div>
            </div>

            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <img
                      src={image}
                      alt={`Issue image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <XIcon className="h-4 w-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed rounded-md p-6 text-muted-foreground">
                <ImageIcon className="h-10 w-10 mb-2" />

                <p className="text-sm">No images added yet</p>
                <p className="text-xs">Click "Add Images" to upload</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Issue</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
