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
import {
  ArrowLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  FileTextIcon,
  SearchIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IssueListItem from "@/polymet/components/issue-list-item";
import IssueForm from "@/polymet/components/issue-form";
import { Project, Issue } from "@/polymet/data/site-audit-data";

interface ProjectDetailsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function ProjectDetails({
  projects,
  setProjects,
}: ProjectDetailsProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "open" | "in-progress" | "resolved"
  >("all");
  const [filterPriority, setFilterPriority] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject);
  }, [projectId, projects]);

  if (!project) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="text-muted-foreground">
          The project you are looking for does not exist.
        </p>
        <Button onClick={() => navigate("/projects")} className="mt-4">
          Go back to Projects
        </Button>
      </div>
    );
  }

  const handleCreateIssue = (issueData: any) => {
    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      title: issueData.title,
      assignee: {
        name: issueData.assignee,
        avatar: "https://github.com/yusufhilmi.png", // Default avatar
      },
      status: issueData.status,
      priority: issueData.priority,
      comments: issueData.comments,
      images: issueData.images.map((url: string) => ({
        url,
        timestamp: new Date().toISOString(),
      })),
      createdAt: new Date().toISOString(),
    };

    const updatedIssues = [...project.issues, newIssue];
    const updatedProject = {
      ...project,
      issues: updatedIssues,
      issueCount: updatedIssues.length,
    };

    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setProject(updatedProject); // Update local project state
    setIsIssueFormOpen(false);
  };

  const handleDeleteProject = () => {
    setProjects(projects.filter((p) => p.id !== project.id));
    navigate("/projects");
  };

  const filteredIssues = project.issues.filter((issue) => {
    const matchesSearch = issue.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || issue.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || issue.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/projects")}>
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">{project.reference}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Thumbnail - Moved to top and spans full width */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Project Thumbnail</CardTitle>
              <CardDescription>Visual representation of the project.</CardDescription>
            </CardHeader>
            <CardContent>
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="rounded-md object-cover w-full h-64" // Increased height
                />
              ) : (
                <div className="flex items-center justify-center h-64 bg-muted rounded-md text-muted-foreground"> {/* Increased height */}
                  No thumbnail available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Project Overview and Issues - Now below thumbnail, spanning full width */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Project Overview</CardTitle>
                  <CardDescription>
                    Details and summary of the project.
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={`/project/${project.id}/edit`}>
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit Project
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileTextIcon className="mr-2 h-4 w-4" />
                      Generate Report
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDeleteProject}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Reference</p>
                <p className="font-medium">{project.reference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{project.date}</p>
              </div>
              {project.client && (
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{project.client.name}</p>
                  {project.client.contact && (
                    <p className="text-sm text-muted-foreground">
                      Contact: {project.client.contact}
                    </p>
                  )}
                  {project.client.email && (
                    <p className="text-sm text-muted-foreground">
                      Email: {project.client.email}
                    </p>
                  )}
                  {project.client.phone && (
                    <p className="text-sm text-muted-foreground">
                      Phone: {project.client.phone}
                    </p>
                  )}
                </div>
              )}
              {project.location && (
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{project.location}</p>
                </div>
              )}
              {project.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p>{project.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Issues ({project.issueCount})</CardTitle>
                  <CardDescription>
                    All issues identified for this project.
                  </CardDescription>
                </div>
                <Dialog open={isIssueFormOpen} onOpenChange={setIsIssueFormOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Add Issue
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Issue</DialogTitle>
                      <DialogDescription>
                        Add details for a new issue in this project.
                      </DialogDescription>
                    </DialogHeader>
                    <IssueForm onSubmit={handleCreateIssue} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search issues..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={filterStatus}
                    onValueChange={(value) =>
                      setFilterStatus(
                        value as "all" | "open" | "in-progress" | "resolved"
                      )
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterPriority}
                    onValueChange={(value) =>
                      setFilterPriority(
                        value as "all" | "low" | "medium" | "high"
                      )
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Filter by Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredIssues.length > 0 ? (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <IssueListItem
                      key={issue.id}
                      to={`/issue/${project.id}/${issue.id}`} 
                      title={issue.title}
                      assignee={issue.assignee}
                      imageUrl={issue.images[0]?.url}
                      status={issue.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No issues found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
