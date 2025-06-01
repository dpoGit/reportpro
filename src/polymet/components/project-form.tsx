import { useState } from "react";
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
import ImageUpload from "@/polymet/components/image-upload"; // Import ImageUpload

interface ProjectFormProps {
  onSubmit?: (project: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
}

export interface ProjectFormData {
  id?: string; // Make ID optional for new projects
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
  thumbnail: string | null; // Add thumbnail field
}

export default function ProjectForm({
  onSubmit,
  initialData,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    id: initialData?.id || undefined, // Initialize ID
    title: initialData?.title || "",
    reference: initialData?.reference || "",
    date: initialData?.date ? new Date(initialData.date) : new Date(), // Ensure date is a Date object
    location: initialData?.location || "",
    client: {
      name: initialData?.client?.name || "",
      contact: initialData?.client?.contact || "",
      email: initialData?.client?.email || "",
      phone: initialData?.client?.phone || "",
    },
    notes: initialData?.notes || "",
    thumbnail: initialData?.thumbnail || null, // Initialize thumbnail
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof Omit<ProjectFormData, "id" | "date" | "client" | "thumbnail">
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const handleClientInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof ProjectFormData["client"]
  ) => {
    setFormData({
      ...formData,
      client: {
        ...formData.client,
        [field]: e.target.value,
      },
    });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({
        ...formData,
        date,
      });
    }
  };

  const handleImageChange = (imageData: string | null) => {
    setFormData({
      ...formData,
      thumbnail: imageData,
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
                value={formData.title}
                onChange={(e) => handleInputChange(e, "title")}
                placeholder="Enter project title"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => handleInputChange(e, "reference")}
                  placeholder="Enter reference code"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />

                      {formData.date ? (
                        format(formData.date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange(e, "location")}
                  placeholder="Enter project location"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="project-image">Project Image</Label>
            <ImageUpload
              initialImage={formData.thumbnail || undefined}
              onImageChange={handleImageChange}
              aspectRatio="wide"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-name">Client Name</Label>
                <Input
                  id="client-name"
                  value={formData.client.name}
                  onChange={(e) => handleClientInputChange(e, "name")}
                  placeholder="Enter client name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client-contact">Contact Person</Label>
                  <Input
                    id="client-contact"
                    value={formData.client.contact}
                    onChange={(e) => handleClientInputChange(e, "contact")}
                    placeholder="Enter contact person"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client-phone">Phone</Label>
                  <Input
                    id="client-phone"
                    type="tel"
                    value={formData.client.phone}
                    onChange={(e) => handleClientInputChange(e, "phone")}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="client-email">Email</Label>
                <Input
                  id="client-email"
                  type="email"
                  value={formData.client.email}
                  onChange={(e) => handleClientInputChange(e, "email")}
                  placeholder="Enter email address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange(e, "notes")}
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
