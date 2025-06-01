import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeftIcon,
  CalendarIcon,
  MapPinIcon,
  MessageSquareIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import IssueForm from "@/polymet/components/issue-form";
import { Project, Issue } from "@/polymet/data/site-audit-data";

interface IssueDetailsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function IssueDetails({ projects, setProjects }: IssueDetailsProps) {
  const { projectId, issueId } = useParams<{ projectId: string; issueId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [issue, setIssue] = useState<Issue | undefined>(undefined);
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject);
    if (foundProject) {
      const foundIssue = foundProject.issues.find((i) => i.id === issueId);
      setIssue(foundIssue);
    }
  }, [projectId, issueId, projects]);

  // Scroll to top when the component mounts or issueId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [issueId]);

  if (!project || !issue) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">Issue Not Found</h1>
        <p className="text-muted-foreground">
          The issue you are looking for does not exist.
        </p>
        <Button onClick={() => navigate(`/project/${projectId}`)} className="mt-4">
          Go back to Project
        </Button>
      </div>
    );
  }

  const handleUpdateIssue = (updatedData: any) => {
    const updatedIssue: Issue = {
      ...issue,
      title: updatedData.title,
      assignee: {
        name: updatedData.assignee,
        avatar: issue?.assignee.avatar || "https://github.com/yusufhilmi.png",
      },
      status: updatedData.status,
      priority: updatedData.priority,
      comments: updatedData.comments,
      images: updatedData.images.map((url: string) => ({
        url,
        timestamp: new Date().toISOString(),
      })),
      updatedAt: new Date().toISOString(),
    };

    const updatedIssues = project.issues.map((i) =>
      i.id === updatedIssue.id ? updatedIssue : i
    );
    const updatedProject = { ...project, issues: updatedIssues };

    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setProject(updatedProject);
    setIssue(updatedIssue);
    setIsIssueFormOpen(false);
  };

  const handleDeleteIssue = () => {
    const updatedIssues = project.issues.filter((i) => i.id !== issue.id);
    const updatedProject = {
      ...project,
      issues: updatedIssues,
      issueCount: updatedIssues.length,
    };
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    navigate(`/project/${projectId}`);
  };

  const getStatusBadgeVariant = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "destructive";
      case "in-progress":
        return "default";
      case "resolved":
        return "success";
      default:
        return "secondary";
    }
  };

  const getPriorityBadgeVariant = (priority: Issue["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/project/${projectId}`)}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <p className="text-muted-foreground">
            Part of project:{" "}
            <Link to={`/project/${project.id}`} className="hover:underline">
              {project.title}
            </Link>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
              <CardDescription>Visual documentation for this issue.</CardDescription>
            </CardHeader>
            <CardContent>
              {issue.images && issue.images.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {issue.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Issue image ${index + 1}`}
                        className="rounded-md object-cover w-full h-48"
                      />
                      {image.timestamp && (
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          {new Date(image.timestamp).toLocaleString()}
                        </div>
                      )}
                      {image.location && image.location.address && (
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center">
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {image.location.address}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No images available for this issue.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{issue.title}</CardTitle>
                  <CardDescription>Issue Details</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Dialog open={isIssueFormOpen} onOpenChange={setIsIssueFormOpen}>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Edit Issue
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Issue</DialogTitle>
                          <DialogDescription>
                            Update details for this issue
                          </DialogDescription>
                        </DialogHeader>
                        <IssueForm
                          onSubmit={handleUpdateIssue}
                          onCancel={() => setIsIssueFormOpen(false)}
                          initialData={issue}
                        />
                      </DialogContent>
                    </Dialog>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDeleteIssue}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete Issue
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(issue.status)}>
                    {issue.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                    {issue.priority}
                  </Badge>
                </div>
              </div>

              {issue.comments && (
                <div>
                  <p className="text-sm text-muted-foreground">Comments</p>
                  <p>{issue.comments}</p>
                </div>
              )}

              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>Created: {new Date(issue.createdAt).toLocaleString()}</span>
              </div>
              {issue.updatedAt && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Last Updated: {new Date(issue.updatedAt).toLocaleString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned To</CardTitle>
              <CardDescription>Person responsible for this issue.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={issue.assignee.avatar} alt={issue.assignee.name} />
                <AvatarFallback>{issue.assignee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{issue.assignee.name}</p>
                <p className="text-sm text-muted-foreground">Assignee</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent activities on this issue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={issue.assignee.avatar} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{issue.assignee.name}</span>{" "}
                    created this issue.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(issue.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              {issue.updatedAt && (
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={issue.assignee.avatar} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{issue.assignee.name}</span>{" "}
                      updated this issue.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(issue.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {/* Add more activity log entries as needed */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
