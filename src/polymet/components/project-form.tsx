import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ImageUpload from "@/polymet/components/image-upload";

interface ProjectFormProps {
  onSubmit?: (project: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
}

export interface ProjectFormData {
  id?: string;
  title: string;
  reference: string;
  date: Date;
  location: string;
  client: {
    name: string;
    contact: string;
    email: string;
    phone: string;
  };
  notes: string;
  thumbnail: string | null;
}

export default function ProjectForm({
  onSubmit,
  initialData,
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      id: initialData?.id || undefined,
      title: initialData?.title || "",
      reference: initialData?.reference || "",
      date: initialData?.date ? new Date(initialData.date) : new Date(),
      location: initialData?.location || "",
      client: {
        name: initialData?.client?.name || "",
        contact: initialData?.client?.contact || "",
        email: initialData?.client?.email || "",
        phone: initialData?.client?.phone || "",
      },
      notes: initialData?.notes || "",
      thumbnail: initialData?.thumbnail || null,
    },
  });

  const handleFormSubmit = (data: ProjectFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Add information about your project and client
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Project title is required" })}
                placeholder="Enter project title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  {...register("reference")}
                  placeholder="Enter reference code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="Enter project location"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-image">Project Image</Label>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  initialImage={field.value || undefined}
                  onImageChange={field.onChange}
                  aspectRatio="wide"
                />
              )}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  {...register("client.name")}
                  placeholder="Enter client name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-contact">Contact Person</Label>
                  <Input
                    id="client-contact"
                    {...register("client.contact")}
                    placeholder="Enter contact person"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    {...register("client.phone")}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  {...register("client.email")}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Enter any additional notes about the project"
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Save Project
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
