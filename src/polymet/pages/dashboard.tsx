import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  CalendarIcon,
  CheckSquareIcon, // Added CheckSquareIcon
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  ImageIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import SiteAuditCard from "@/polymet/components/site-audit-card";
import IssueListItem from "@/polymet/components/issue-list-item";
import ProjectForm, { ProjectFormData } from "@/polymet/components/project-form"; // Import ProjectFormData
import IssueForm from "@/polymet/components/issue-form";
import { Project, Issue, PROJECTS } from "@/polymet/data/site-audit-data";
import { useIsMobile } from "@/hooks/use-mobile"; // Import the hook

interface DashboardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function Dashboard({ projects, setProjects }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null); // New state for editing
  const [isIssueFormOpen, setIsIssueFormOpen] = useState(false);

  const isMobile = useIsMobile(); // Use the hook
  const projectDetailsCardRef = useRef<HTMLDivElement>(null); // Ref for the project details card

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSaveProject = (projectData: ProjectFormData) => {
    if (projectData.id) {
      // Editing existing project
      const updatedProject: Project = {
        ...projectData,
        date: projectData.date.toISOString().split("T")[0],
        issueCount:
          projects.find((p) => p.id === projectData.id)?.issueCount || 0,
        issues: projects.find((p) => p.id === projectData.id)?.issues || [],
      };
      setProjects(
        projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
      if (selectedProject?.id === updatedProject.id) {
        setSelectedProject(updatedProject);
      }
    } else {
      // Creating new project
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        title: projectData.title,
        reference: projectData.reference,
        date: projectData.date.toISOString().split("T")[0],
        thumbnail: projectData.thumbnail || "https://picsum.photos/seed/" + Date.now() + "/400/200",
        client: projectData.client,
        location: projectData.location,
        notes: projectData.notes,
        issueCount: 0,
        issues: [],
      };
      setProjects([newProject, ...projects]);
    }
    setIsProjectFormOpen(false);
    setEditingProject(null); // Clear editing state
  };

  const handleCreateIssue = (issueData: any) => {
    if (!selectedProject) return;

    const newIssue: Issue = {
      id: `issue-${Date.now()}`,
      title: issueData.title,
      assignee: {
        name: issueData.assignee,
        avatar: "https://github.com/yusufhilmi.png",
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

    const updatedProject = {
      ...selectedProject,
      issues: [newIssue, ...selectedProject.issues],
      issueCount: selectedProject.issueCount + 1,
    };

    setProjects(
      projects.map((p) => (p.id === selectedProject.id ? updatedProject : p))
    );
    setSelectedProject(updatedProject);
    setIsIssueFormOpen(false);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleOpenEditProject = (project: Project) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  // Effect to scroll to the project details card when a project is selected, for all screen sizes
  useEffect(() => {
    if (selectedProject && projectDetailsCardRef.current) {
      projectDetailsCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedProject]); // Dependency array updated to only selectedProject

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <CheckSquareIcon className="mr-2 h-7 w-7 text-primary" /> {/* Added Icon */}
            Report<span className="text-orange-500">Pro</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your projects and issues efficiently
          </p>
        </div>
        <Dialog
          open={isProjectFormOpen}
          onOpenChange={(open) => {
            setIsProjectFormOpen(open);
            if (!open) {
              setEditingProject(null); // Clear editing state when dialog closes
            }
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProject(null)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Edit Project" : "Create New Project"}
              </DialogTitle>
              <DialogDescription>
                {editingProject
                  ? "Update details for your project"
                  : "Add details for your new project"}
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              onSubmit={handleSaveProject}
              initialData={editingProject || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Projects</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FilterIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Recent Projects</DropdownMenuItem>
                    <DropdownMenuItem>Alphabetical</DropdownMenuItem>
                    <DropdownMenuItem>Most Issues</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input
                  placeholder="Search projects..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="cursor-pointer"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <div
                        className={`border rounded-lg overflow-hidden transition-colors ${
                          selectedProject?.id === project.id
                            ? "border-orange-500 bg-orange-500/10" // Changed to orange highlight
                            : "hover:bg-accent/50"
                        }`}
                      >
                        <div className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <FolderIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium line-clamp-1">
                                  {project.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {project.reference}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenEditProject(project);
                                  }}
                                >
                                  <PencilIcon className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteProject(project.id);
                                  }}
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <CalendarIcon className="mr-1 h-3 w-3" />

                              {project.date}
                            </div>
                            <div className="text-xs font-medium">
                              {project.issueCount}{" "}
                              {project.issueCount === 1 ? "Issue" : "Issues"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    No projects found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedProject ? (
            <Card ref={projectDetailsCardRef}> {/* Attach ref here */}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedProject.title}</CardTitle>
                    <CardDescription>
                      {selectedProject.reference} • {selectedProject.date}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleOpenEditProject(selectedProject)}
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteProject(selectedProject.id)}
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {/* Project Image - Moved to top of CardContent */}
                {selectedProject.thumbnail && (
                  <div className="mb-6"> {/* Added margin-bottom */}
                    <img
                      src={selectedProject.thumbnail}
                      alt={selectedProject.title}
                      className="rounded-md max-h-64 w-full object-cover"
                    />
                  </div>
                )}
                <Tabs defaultValue="issues">
                  <TabsList className="mb-4">
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="details">Project Details</TabsTrigger>
                  </TabsList>
                  <TabsContent value="issues" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">
                        {selectedProject.issueCount}{" "}
                        {selectedProject.issueCount === 1 ? "Issue" : "Issues"}
                      </h3>
                      <Dialog
                        open={isIssueFormOpen}
                        onOpenChange={setIsIssueFormOpen}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Add Issue
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Create New Issue</DialogTitle>
                            <DialogDescription>
                              Add details for the new issue
                            </DialogDescription>
                          </DialogHeader>
                          <IssueForm
                            onSubmit={handleCreateIssue}
                            onCancel={() => setIsIssueFormOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                      {selectedProject.issues.length > 0 ? (
                        selectedProject.issues.map((issue) => (
                          <IssueListItem
                            key={issue.id}
                            to={`/issue/${selectedProject.id}/${issue.id}`}
                            title={issue.title}
                            assignee={issue.assignee}
                            imageUrl={issue.images[0]?.url}
                            status={issue.status}
                          />
                        ))
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No issues found for this project
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="details">
                    <div className="space-y-6">
                      {selectedProject.client && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            Client Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Client Name
                              </p>
                              <p>{selectedProject.client.name}</p>
                            </div>
                            {selectedProject.client.contact && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Contact Person
                                </p>
                                <p>{selectedProject.client.contact}</p>
                              </div>
                            )}
                            {selectedProject.client.email && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Email
                                </p>
                                <p>{selectedProject.client.email}</p>
                              </div>
                            )}
                            {selectedProject.client.phone && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Phone
                                </p>
                                <p>{selectedProject.client.phone}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedProject.location && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Location</h3>
                          <p>{selectedProject.location}</p>
                        </div>
                      )}

                      {selectedProject.notes && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Notes</h3>
                          <p>{selectedProject.notes}</p>
                        </div>
                      )}

                      {/* Project Image - Removed from here */}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <FolderIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

                <h2 className="text-xl font-medium mb-2">
                  No Project Selected
                </h2>
                <p className="text-muted-foreground mb-6">
                  Select a project from the list or create a new one
                </p>
                <Dialog
                  open={isProjectFormOpen}
                  onOpenChange={(open) => {
                    setIsProjectFormOpen(open);
                    if (!open) {
                      setEditingProject(null); // Clear editing state when dialog closes
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProject(null)}>
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProject ? "Edit Project" : "Create New Project"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProject
                          ? "Update details for your project"
                          : "Add details for your new project"}
                      </DialogDescription>
                    </DialogHeader>
                    <ProjectForm
                      onSubmit={handleSaveProject}
                      initialData={editingProject || undefined}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
