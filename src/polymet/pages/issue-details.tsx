import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Trash2 } from "lucide-react";
import { Project, Issue } from "@/polymet/data/site-audit-data";

interface IssueDetailsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

// Color palette for issue types (matching AnalysisReport)
const issueColors = [
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#9C27B0', // Purple
  '#009688', // Teal
  '#FF9800', // Orange
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#F44336', // Red
];

export default function IssueDetails({ projects, setProjects }: IssueDetailsProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [selectedIssue, setSelectedIssue] = useState<Issue | undefined>(undefined);

  useEffect(() => {
    const foundProject = projects.find((p) => p.id === projectId);
    setProject(foundProject);
    if (foundProject && foundProject.issues.length > 0) {
      setSelectedIssue(foundProject.issues[0]);
    }
  }, [projectId, projects]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return (
      <div className="container mx-auto p-4 md:p-6 text-center">
        <h1 className="text-2xl font-bold">Project Not Found</h1>
        <p className="text-muted-foreground">
          The project you are looking for does not exist.
        </p>
        <Button onClick={() => navigate('/projects')} className="mt-4">
          Go back to Projects
        </Button>
      </div>
    );
  }

  const handleDeleteIssue = (issueId: string) => {
    const updatedIssues = project.issues.filter((i) => i.id !== issueId);
    const updatedProject = {
      ...project,
      issues: updatedIssues,
      issueCount: updatedIssues.length,
    };
    setProjects(
      projects.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setProject(updatedProject);

    // If we deleted the selected issue, select the first remaining one
    if (selectedIssue?.id === issueId && updatedIssues.length > 0) {
      setSelectedIssue(updatedIssues[0]);
    } else if (updatedIssues.length === 0) {
      setSelectedIssue(undefined);
    }
  };

  const getIssueColor = (index: number) => {
    return issueColors[index % issueColors.length];
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="container mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/projects')}
            className="hover:bg-slate-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Issue Review</h1>
            <p className="text-sm text-slate-500">{project.title}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Image Display */}
          <div className="space-y-4">
            {selectedIssue && selectedIssue.images && selectedIssue.images.length > 0 ? (
              <>
                {/* Primary Image */}
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <img
                    src={selectedIssue.images[0].url}
                    alt="Primary issue"
                    className="w-full h-auto object-contain"
                  />

                  {/* Bounding Boxes */}
                  {selectedIssue.images[0].boundingBoxes?.map((box, index) => {
                    const [ymin, xmin, ymax, xmax] = box.box_2d;
                    const isRightSide = xmin > 500;

                    return (
                      <div
                        key={index}
                        className="absolute border-2 transition-all duration-300 hover:z-30 group/box cursor-help"
                        style={{
                          top: `${(ymin / 1000) * 100}%`,
                          left: `${(xmin / 1000) * 100}%`,
                          height: `${((ymax - ymin) / 1000) * 100}%`,
                          width: `${((xmax - xmin) / 1000) * 100}%`,
                          borderColor: box.color || '#FACC15',
                          boxShadow: `0 0 8px ${box.color || '#FACC15'}, inset 0 0 8px ${box.color || '#FACC15'}33`
                        }}
                      >
                        {/* Label - Always Visible */}
                        <div
                          className={`absolute -top-7 ${isRightSide ? 'right-0' : 'left-0'} px-3 py-1 text-xs font-bold text-black rounded-md whitespace-nowrap shadow-lg pointer-events-none transition-all duration-200 group-hover/box:scale-105`}
                          style={{ backgroundColor: box.color || '#FACC15' }}
                        >
                          {box.label}
                        </div>

                        {/* Description Tooltip - Visible on hover */}
                        <div
                          className={`absolute top-full ${isRightSide ? 'right-0' : 'left-0'} mt-2 w-56 bg-slate-900/95 dark:bg-black/95 text-white text-xs p-3 rounded-xl shadow-2xl border border-white/10 opacity-0 group-hover/box:opacity-100 transition-all duration-200 transform translate-y-2 group-hover/box:translate-y-0 pointer-events-none z-50 backdrop-blur-md`}
                        >
                          <div className="font-bold mb-1.5 border-b border-white/10 pb-1.5 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: box.color }}></div>
                            <span style={{ color: box.color }}>{box.label}</span>
                          </div>
                          <div className="leading-relaxed text-slate-300">{box.description}</div>
                        </div>
                      </div>
                    );
                  })}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4 bg-white hover:bg-slate-100 text-slate-900"
                  >
                    🔄 Retake
                  </Button>
                </div>

                {/* Supporting Images */}
                {selectedIssue.images.length > 1 && (
                  <div>
                    <h3 className="text-sm text-slate-500 mb-3 font-medium">
                      Supporting Images <span className="text-slate-400">(Optional)</span>
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedIssue.images.slice(1).map((image, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden bg-slate-200 border border-slate-300"
                        >
                          <img
                            src={image.url}
                            alt={`Supporting ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-slate-200 rounded-2xl h-96 flex items-center justify-center text-slate-400">
                No images available
              </div>
            )}
          </div>

          {/* Right Column: Issues List */}
          <div className="space-y-4">
            {/* Project Header */}
            <div className="mb-2">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                PROJECT: {project.title.toUpperCase()}
              </p>
            </div>

            {/* Issues Section */}
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                  Detected Issues
                </h4>
                <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {project.issues.length} Found
                </span>
              </div>

              {/* Issues List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {project.issues.length > 0 ? (
                  project.issues.map((issue, idx) => {
                    const color = getIssueColor(idx);
                    return (
                      <div
                        key={issue.id}
                        onClick={() => setSelectedIssue(issue)}
                        className={`bg-white rounded-xl p-4 flex gap-4 border transition-all cursor-pointer group ${selectedIssue?.id === issue.id
                          ? 'border-slate-300 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                          }`}
                      >
                        <div
                          className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ring-2 ring-offset-2 ring-offset-white"
                          style={{
                            backgroundColor: color,
                            '--tw-ring-color': color
                          } as React.CSSProperties}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1 gap-2">
                            <span
                              className="text-sm font-bold"
                              style={{ color }}
                            >
                              {issue.title}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteIssue(issue.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1 flex-shrink-0"
                              title="Delete Issue"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            {issue.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    No issues detected for this project
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
