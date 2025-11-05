import { Project } from "@/polymet/data/site-audit-data";

// Helper to sanitize filenames
const sanitizeFilename = (name: string) => {
  return name.replace(/[^a-z0-9\s\-_.]/gi, "").replace(/\s+/g, "_");
};

export const exportProjectToCSV = (project: Project) => {
  if (!project) {
    console.error("Project not found for report:");
    return;
  }

  const headers = [
    "#",
    "Title",
    "Assignee",
    "Status",
    "Priority",
    "Created",
    "Comments",
  ];
  const rows = project.issues.map((issue, index) => [
    index + 1,
    `"${issue.title.replace(/"/g, '""')}"`,
    `"${issue.assignee.name.replace(/"/g, '""')}"`,
    `"${issue.status.replace("-", " ").replace(/"/g, '""')}"`,
    `"${issue.priority.replace(/"/g, '""')}"`,
    `"${new Date(issue.createdAt).toLocaleDateString().replace(/"/g, '""')}"`,
    `"${
      issue.comments &&
      Array.isArray(issue.comments) &&
      issue.comments.length > 0
        ? issue.comments
            .map((comment) => comment.text)
            .join(" | ")
            .replace(/"/g, '""')
        : ""
    }"`,
  ]);

  const content = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");
  const filename = `${sanitizeFilename(project.title)}_Issues.csv`;
  const mimeType = "text/csv;charset=utf-8;";

  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    setTimeout(() => {
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log(`Downloaded ${filename}`);
    }, 0);
  } catch (error) {
    console.error("Error during download process for reports list:", error);
  }
};
