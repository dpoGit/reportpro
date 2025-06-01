import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowDownIcon,
  CalendarIcon,
  DownloadIcon,
  FileTextIcon,
  FilterIcon,
  PlusIcon,
  ShareIcon,
} from "lucide-react";
import { PROJECTS } from "@/polymet/data/site-audit-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function Reports() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const reports = PROJECTS.map((project) => ({
    id: `report-${project.id}`,
    projectId: project.id,
    title: `${project.title} Audit Report`,
    projectTitle: project.title,
    date: project.date,
    status: Math.random() > 0.5 ? "completed" : "draft",
    author: {
      name: "John Doe",
      avatar: "https://github.com/yusufhilmi.png",
    },
    issueCount: project.issueCount,
    format: Math.random() > 0.5 ? "PDF" : "CSV",
  }));

  const filteredReports = reports.filter((report) => {
    if (selectedTab !== "all" && report.status !== selectedTab) return false;
    if (
      searchQuery &&
      !report.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleGenerateReport = () => {
    alert("Generate New Report functionality coming soon!");
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Manage and generate reports for your site audits
          </p>
        </div>
        <Button onClick={handleGenerateReport}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => setSelectedTab(value)}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />

              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />

                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>

            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <ReportsList reports={filteredReports} />
        </TabsContent>
        <TabsContent value="completed" className="mt-0">
          <ReportsList reports={filteredReports} />
        </TabsContent>
        <TabsContent value="draft" className="mt-0">
          <ReportsList reports={filteredReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ReportsList({ reports }) {
  // Helper to sanitize filenames
  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9\s\-_.]/gi, '').replace(/\s+/g, '_');
  };

  const handleDownloadForReport = (e: React.MouseEvent, report: any) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the Link
    e.preventDefault(); // Prevent the default action of the Link

    const project = PROJECTS.find(p => p.id === report.projectId);

    if (!project) {
      console.error("Project not found for report:", report);
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
      // Fix: Join comments text if issue.comments is an array of objects
      `"${issue.comments && Array.isArray(issue.comments) && issue.comments.length > 0
        ? issue.comments.map(comment => comment.text).join(" | ").replace(/"/g, '""')
        : ""}"`,
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

  const handleShareReport = (e: React.MouseEvent, report: any) => {
    e.stopPropagation(); // Prevent the click from bubbling up to the Link
    e.preventDefault(); // Prevent the default action of the Link
    alert(`Share functionality for report "${report.title}" coming soon!`);
  };

  if (reports.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileTextIcon className="h-16 w-16 text-muted-foreground mb-4" />

          <h3 className="text-xl font-medium mb-2">No reports found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No reports match your current filters. Try adjusting your search or
            create a new report.
          </p>
          <Button onClick={handleGenerateReport} className="mt-6">Generate New Report</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {reports.map((report) => (
        <Link key={report.id} to={`/report/${report.projectId}`} className="block">
          <Card className="overflow-hidden transition-colors hover:bg-accent/50 hover:border-primary">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium">{report.title}</h3>
                    <Badge
                      variant={
                        report.status === "completed" ? "default" : "outline"
                      }
                      className={
                        report.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }
                    >
                      {report.status === "completed" ? "Completed" : "Draft"}
                    </Badge>
                    <Badge variant="outline">{report.format}</Badge>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2" />

                      {new Date(report.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-4 w-4 mr-2">
                        <AvatarImage src={report.author.avatar} />

                        <AvatarFallback>
                          {report.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {report.author.name}
                    </div>
                    <div>
                      {report.issueCount} issue{report.issueCount !== 1 && "s"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-6 bg-muted/50 md:w-48">
                  <Button variant="outline" size="sm" onClick={(e) => handleShareReport(e, report)}>
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" onClick={(e) => handleDownloadForReport(e, report)}>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
