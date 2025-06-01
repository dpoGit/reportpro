import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon, ArrowRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom"; // Import Link

interface IssueListItemProps {
  title: string;
  assignee: {
    name: string;
    avatar?: string;
  };
  imageUrl?: string;
  status?: "open" | "resolved" | "in-progress";
  to: string; // Add 'to' prop for navigation
}

export default function IssueListItem({
  title,
  assignee,
  imageUrl,
  status = "open",
  to, // Destructure 'to' prop
}: IssueListItemProps) {
  return (
    <Link
      to={to} // Use 'to' prop for Link
      className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-accent/50 cursor-pointer block" // Add 'block' to ensure Link takes full width
    >
      {imageUrl && (
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-0 right-0 rounded-tl-md bg-black/60 p-0.5">
            <ImageIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium line-clamp-1">{title}</h3>
          <Badge
            variant="outline"
            className={cn("ml-2 capitalize", {
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300":
                status === "open",
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300":
                status === "resolved",
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300":
                status === "in-progress",
            })}
          >
            {status.replace("-", " ")}
          </Badge>
        </div>
        <div className="mt-1 flex items-center text-sm text-muted-foreground">
          <Avatar className="mr-1 h-4 w-4">
            <AvatarImage src={assignee.avatar} />

            <AvatarFallback>
              {assignee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="line-clamp-1">{assignee.name}</span>
        </div>
      </div>
      <ArrowRightIcon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
    </Link>
  );
}
