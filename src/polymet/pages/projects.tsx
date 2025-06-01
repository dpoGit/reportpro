import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  FilterIcon,
  FolderIcon,
  GridIcon,
  ListIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  PencilIcon,
  FileTextIcon,
} from "lucide-react";
import { PROJECTS, Project } from "@/polymet/data/site-audit-data"; // Import Project type
import ProjectForm, { ProjectFormData } from "@/polymet/components/project-form"; // Import ProjectFormData

interface ProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function Projects({ projects, setProjects }: ProjectsProps) {
  // projects state is now managed by App.tsx and passed as props
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date" | "name" | "issues">("date");
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const handleCreateProject = (projectData: ProjectFormData) => { // Use ProjectFormData type
    const newProject = {
      id: `proj-${Date.now()}`,
      title: projectData.title,
      reference: projectData.reference,
      date: projectData.date.toISOString().split("T")[0],
      thumbnail: projectData.thumbnail || "https://picsum.photos/seed/" + Date.now() + "/400/200", // Use uploaded thumbnail or fallback
      client: projectData.client,
      location: projectData.location,
      notes: projectData.notes,
      issueCount: 0,
      issues: [],
    };

    setProjects([newProject, ...projects]); // Use passed setProjects
    setIsProjectFormOpen(false);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId)); // Use passed setProjects
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "issues") {
      return b.issueCount - a.issueCount;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">
            Manage and organize your site audit projects
          </p>
        </div>
        <Dialog open={isProjectFormOpen} onOpenChange={setIsProjectFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Add details for your new project
              </DialogDescription>
            </DialogHeader>
            <ProjectForm onSubmit={handleCreateProject} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 w-full md:max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as "date" | "name" | "issues")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (newest first)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="issues">Most Issues</SelectItem>
                </SelectContent>
              </Select>
              <div className="border rounded-md flex">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <GridIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {sortedProjects.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden transition-colors hover:bg-accent/50 hover:border-primary">
                {/* Wrap the entire card content in a Link, excluding the dropdown trigger */}
                <Link to={`/project/${project.id}`} className="block">
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <FolderIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {/* Remove nested Link here, as parent Card is now linked */}
                          {project.title}
                        </CardTitle>
                        <CardDescription>{project.reference}</CardDescription>
                      </div>
                      {/* DropdownMenuTrigger needs to be outside the main Link to be clickable */}
                      {/* It will be placed after the Link, but visually positioned */}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {project.date}
                      </div>
                      <div className="font-medium">
                        {project.issueCount}{" "}
                        {project.issueCount === 1 ? "Issue" : "Issues"}
                      </div>
                    </div>
                    {project.client && (
                      <div className="mt-2 text-sm text-muted-foreground">
                        Client: {project.client.name}
                      </div>
                    )}
                  </CardContent>
                </Link>
                {/* DropdownMenu for actions, positioned outside the main Link */}
                <div className="absolute top-4 right-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to parent Link
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/project/${project.id}`}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        Generate Report
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to parent Link
                          handleDeleteProject(project.id);
                        }}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedProjects.map((project) => (
              <Card key={project.id} className="transition-colors hover:bg-accent/50 hover:border-primary">
                {/* Wrap the entire CardContent in a Link, excluding the dropdown trigger */}
                <Link to={`/project/${project.id}`} className="block p-4"> {/* Added p-4 to Link for consistent padding */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <FolderIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium hover:underline"> {/* Removed Link here, as parent CardContent is now linked */}
                          {project.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {project.reference} • {project.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm font-medium">
                        {project.issueCount}{" "}
                        {project.issueCount === 1 ? "Issue" : "Issues"}
                      </div>
                      {/* DropdownMenuTrigger needs to be outside the main Link to be clickable */}
                      {/* It will be placed after the Link, but visually positioned */}
                    </div>
                  </div>
                </Link>
                {/* DropdownMenu for actions, positioned outside the main Link */}
                <div className="absolute top-4 right-4"> {/* Adjust positioning as needed */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()} // Prevent click from propagating to parent Link
                      >
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/project/${project.id}`}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileTextIcon className="mr-2 h-4 w-4" />
                        Generate Report
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent click from propagating to parent Link
                          handleDeleteProject(project.id);
                        }}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />

          <h2 className="text-xl font-medium mb-2">No Projects Found</h2>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "No projects match your search criteria"
              : "Create your first project to get started"}
          </p>
          <Button onClick={() => setIsProjectFormOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New Project
          </Button>
        </div>
      )}
    </div>
  );
}
