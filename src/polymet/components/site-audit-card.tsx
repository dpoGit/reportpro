import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, ClipboardIcon, ImageIcon } from "lucide-react";

interface SiteAuditCardProps {
  title: string;
  reference: string;
  date: string;
  issueCount: number;
  thumbnail?: string;
  client?: string;
}

export default function SiteAuditCard({
  title,
  reference,
  date,
  issueCount,
  thumbnail,
  client,
}: SiteAuditCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        {thumbnail && (
          <div className="h-32 w-full overflow-hidden">
            <img
              src={thumbnail}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {reference}
          </Badge>
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
          >
            {issueCount} {issueCount === 1 ? "Issue" : "Issues"}
          </Badge>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{title}</CardTitle>
        <CardDescription className="flex items-center justify-between">
          <span>{date}</span>
          {client && <span className="text-sm font-medium">{client}</span>}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" className="text-xs">
          <ClipboardIcon className="mr-1 h-3 w-3" />
          View Details
        </Button>
        <Button variant="secondary" size="sm" className="text-xs">
          <ImageIcon className="mr-1 h-3 w-3" />
          Issues
        </Button>
      </CardFooter>
    </Card>
  );
}
