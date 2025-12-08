import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  CheckSquareIcon,
  FilterIcon,
  FolderIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  SparklesIcon,
} from "lucide-react";
import IssueListItem from "@/polymet/components/issue-list-item";
import ProjectForm, { ProjectFormData } from "@/polymet/components/project-form";
import { Project, Client } from "@/polymet/data/site-audit-data";

interface DashboardProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

export default function Dashboard({ projects, setProjects }: DashboardProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const projectDetailsCardRef = useRef<HTMLDivElement>(null);

  // Helper to get client name for display
  const getClientName = (client: string | Client | undefined): string => {
    if (!client) return '';
    return typeof client === 'string' ? client : client.name;
  };

  // Helper to get client as object (for detailed display)
  const getClientObject = (client: string | Client | undefined): Client | null => {
    if (!client) return null;
    return typeof client === 'object' ? client : null;
  };

  // Helper to convert Project to ProjectFormData format for the form
  const projectToFormData = (project: Project): Partial<ProjectFormData> => {
    const clientObj = typeof project.client === 'object' ? project.client : null;
    return {
      id: project.id,
      title: project.title,
      reference: project.reference,
      client: {
        name: clientObj?.name || (typeof project.client === 'string' ? project.client : ''),
        contact: clientObj?.contact || '',
        email: clientObj?.email || '',
        phone: clientObj?.phone || '',
      },
      location: project.location,
      notes: project.notes,
      thumbnail: project.thumbnail || null,
      date: new Date(project.date),
    };
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.reference?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      getClientName(project.client).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleSaveProject = (projectData: ProjectFormData) => {
    if (projectData.id) {
      // Editing existing project
      const existingProject = projects.find((p) => p.id === projectData.id);
      const updatedProject: Project = {
        id: projectData.id,
        title: projectData.title,
        reference: projectData.reference,
        client: projectData.client,
        location: projectData.location,
        notes: projectData.notes,
        thumbnail: projectData.thumbnail || undefined,
        date: projectData.date.toISOString().split("T")[0],
        status: existingProject?.status || "Pending",
        progress: existingProject?.progress || 0,
        issueCount: existingProject?.issueCount || 0,
        issues: existingProject?.issues || [],
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
        status: "Pending",
        progress: 0,
        issueCount: 0,
        issues: [],
      };
      setProjects([newProject, ...projects]);
    }
    setIsProjectFormOpen(false);
    setEditingProject(null); // Clear editing state
  };

  const handleAddIssue = () => {
    if (selectedProject) {
      navigate(`/project/${selectedProject.id}/add-issue`);
    }
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
        <Button onClick={() => window.location.href = '/create-project'}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
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
                        className={`border rounded-lg overflow-hidden transition-colors ${selectedProject?.id === project.id
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
                      <Button size="sm" onClick={handleAddIssue}>
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        + Add Issue/Snag
                      </Button>
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
                      {(() => {
                        const clientObj = getClientObject(selectedProject.client);
                        if (!clientObj) return null;
                        return (
                          <div>
                            <h3 className="text-lg font-medium mb-2">
                              Client Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Client Name
                                </p>
                                <p>{clientObj.name}</p>
                              </div>
                              {clientObj.contact && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Contact Person
                                  </p>
                                  <p>{clientObj.contact}</p>
                                </div>
                              )}
                              {clientObj.email && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Email
                                  </p>
                                  <p>{clientObj.email}</p>
                                </div>
                              )}
                              {clientObj.phone && (
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Phone
                                  </p>
                                  <p>{clientObj.phone}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}

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
                <Button onClick={() => window.location.href = '/create-project'}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
