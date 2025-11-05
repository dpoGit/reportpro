import { useForm, Controller, useFieldArray } from "react-hook-form";
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
import { ImageIcon, PlusIcon, XIcon } from "lucide-react";

interface IssueFormProps {
  onSubmit?: (issue: IssueFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<IssueFormData>;
}

export interface IssueFormData {
  title: string;
  assignee: string;
  comments: string;
  images: { url: string }[];
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
}

export default function IssueForm({
  onSubmit,
  onCancel,
  initialData,
}: IssueFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueFormData>({
    defaultValues: {
      title: initialData?.title || "",
      assignee: initialData?.assignee || "",
      comments: initialData?.comments || "",
      images: initialData?.images?.map((url) => ({ url })) || [],
      status: initialData?.status || "open",
      priority: initialData?.priority || "medium",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          append({ url: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmit = (data: IssueFormData) => {
    if (onSubmit) {
      onSubmit({
        ...data,
        images: data.images.map((img) => img.url),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                {...register("title", { required: "Title is required" })}
                placeholder="Enter issue title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignee">Assignee</Label>
                <Input
                  id="assignee"
                  {...register("assignee")}
                  placeholder="Enter assignee name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
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
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
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
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                {...register("comments")}
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

            {fields.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="relative aspect-square rounded-md overflow-hidden border"
                  >
                    <img
                      src={field.url}
                      alt={`Issue image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-black/70 rounded-full p-1"
                      onClick={() => remove(index)}
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
