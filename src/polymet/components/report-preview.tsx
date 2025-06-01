import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DownloadIcon,
  FileTextIcon,
  MailIcon,
  PrinterIcon,
  ShareIcon,
} from "lucide-react";
import ReportOptions from "@/polymet/components/report-options";
import { Project, Issue, ReportSettings, DEFAULT_REPORT_SETTINGS } from "@/polymet/data/site-audit-data";

interface ReportPreviewProps {
  project: Project;
  settings?: ReportSettings;
}

export default function ReportPreview({
  project,
  settings,
}: ReportPreviewProps) {
  const [reportSettings, setReportSettings] = useState<ReportSettings>(
    settings || DEFAULT_REPORT_SETTINGS
  );
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pdf");

  const handleSettingsChange = (options: ReportSettings) => {
    setReportSettings(options);
    setIsOptionsOpen(false);
    // Potentially trigger a re-render or re-fetch if settings affect displayed data significantly
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-red-500 dark:text-red-400";
      case "in-progress":
        return "text-yellow-500 dark:text-yellow-400";
      case "resolved":
        return "text-green-500 dark:text-green-400";
      default:
        return "";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "Low Priority";
      case "medium":
        return "Medium Priority";
      case "high":
        return "High Priority";
      default:
        return "";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "text-blue-500 dark:text-blue-400";
      case "medium":
        return "text-yellow-500 dark:text-yellow-400";
      case "high":
        return "text-red-500 dark:text-red-400";
      default:
        return "";
    }
  };

  const getClientName = (client: string | Project['client']) => {
    if (typeof client === 'string') {
      return client;
    }
    return client?.name || 'N/A';
  };

  // Helper to sanitize filenames
  const sanitizeFilename = (name: string) => {
    return name.replace(/[^a-z0-9\s\-_.]/gi, '').replace(/\s+/g, '_');
  };

  const handleDownload = () => {
    console.log("handleDownload called. activeTab:", activeTab);
    let content: string;
    let filename: string;
    let mimeType: string;

    if (activeTab === "pdf") {
      // For actual PDF generation, a library like jsPDF or a server-side solution would be needed.
      // This is a placeholder text file download.
      let pdfTextContent = `SITE AUDIT REPORT\n`;
      pdfTextContent += `====================================\n`;
      pdfTextContent += `Project Title: ${project.title}\n`;
      pdfTextContent += `Reference: ${project.reference}\n`;
      pdfTextContent += `Date: ${new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
      pdfTextContent += `Prepared by: Granville Auditing Co\n`;
      pdfTextContent += `Client: ${getClientName(project.client)}\n`;
      if (typeof project.client !== 'string' && project.client.contact) {
        pdfTextContent += `Client Contact: ${project.client.contact}\n`;
      }
      pdfTextContent += `Location: ${project.location || 'N/A'}\n`;
      pdfTextContent += `Total Issues: ${project.issues.length}\n`;
      pdfTextContent += `====================================\n\n`;
      pdfTextContent += `ISSUES SUMMARY\n`;
      pdfTextContent += `------------------------------------\n`;
      project.issues.forEach((issue, index) => {
        pdfTextContent += `\nIssue #${index + 1}: ${issue.title}\n`;
        pdfTextContent += `  Status: ${issue.status.replace("-", " ")}\n`;
        pdfTextContent += `  Priority: ${getPriorityLabel(issue.priority)}\n`;
        pdfTextContent += `  Assignee: ${issue.assignee.name}\n`;
        pdfTextContent += `  Created: ${new Date(issue.createdAt).toLocaleDateString()}\n`;
        if (issue.updatedAt) {
          pdfTextContent += `  Updated: ${new Date(issue.updatedAt).toLocaleDateString()}\n`;
        }
        if (issue.comments && issue.comments.length > 0) {
          pdfTextContent += `  Comments:\n`;
          issue.comments.forEach(comment => {
            pdfTextContent += `    - ${comment.author}: ${comment.text}\n`;
          });
        }
        if (reportSettings.includePhotos && issue.images.length > 0) {
          pdfTextContent += `  Images: ${issue.images.length} image(s) included in the full report.\n`;
        }
        pdfTextContent += `------------------------------------\n`;
      });
      content = pdfTextContent;
      filename = `${sanitizeFilename(project.title)}_Report.txt`; // Changed to .txt as it's text
      mimeType = "text/plain;charset=utf-8;";
      console.log("PDF (Text) download selected. Filename:", filename);
    } else if (activeTab === "csv") {
      const headers = [
        "#", "Title", "Assignee", "Status", "Priority", "Created", "Comments",
        ...(reportSettings.includeImagesInCSV ? ["Images (Count)"] : []), // Clarified header
      ];
      const rows = project.issues.map((issue, index) => [
        index + 1,
        `"${issue.title.replace(/"/g, '""')}"`,
        `"${issue.assignee.name.replace(/"/g, '""')}"`,
        `"${issue.status.replace("-", " ").replace(/"/g, '""')}"`,
        `"${issue.priority.replace(/"/g, '""')}"`,
        `"${new Date(issue.createdAt).toLocaleDateString().replace(/"/g, '""')}"`,
        `"${issue.comments ? issue.comments.map(c => c.text).join(" | ").replace(/"/g, '""') : ""}"`,
        ...(reportSettings.includeImagesInCSV
          ? [`"${issue.images.length > 0 ? `${issue.images.length}` : "0"}"`] // Just count for CSV
          : []),
      ]);

      content = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      filename = `${sanitizeFilename(project.title)}_Issues.csv`;
      mimeType = "text/csv;charset=utf-8;";
      console.log("CSV download selected. Filename:", filename);
    } else {
      console.warn("No valid active tab selected for download. activeTab:", activeTab);
      return;
    }

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
        console.log("Download process completed. Check browser downloads.");
      }, 0);
    } catch (error) {
      console.error("Error during download process:", error);
    }
  };

  const generateReportContentForEmail = () => {
    let content: string;
    let type: string;

    if (activeTab === "pdf") {
      let pdfTextContent = `SITE AUDIT REPORT\n`;
      pdfTextContent += `====================================\n`;
      pdfTextContent += `Project Title: ${project.title}\n`;
      pdfTextContent += `Reference: ${project.reference}\n`;
      pdfTextContent += `Date: ${new Date(project.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n`;
      pdfTextContent += `Prepared by: Granville Auditing Co\n`;
      pdfTextContent += `Client: ${getClientName(project.client)}\n`;
      if (typeof project.client !== 'string' && project.client.contact) {
        pdfTextContent += `Client Contact: ${project.client.contact}\n`;
      }
      pdfTextContent += `Location: ${project.location || 'N/A'}\n`;
      pdfTextContent += `Total Issues: ${project.issues.length}\n`;
      pdfTextContent += `====================================\n\n`;
      pdfTextContent += `ISSUES SUMMARY (Text Preview)\n`;
      pdfTextContent += `------------------------------------\n`;
      project.issues.forEach((issue, index) => {
        pdfTextContent += `\nIssue #${index + 1}: ${issue.title}\n`;
        pdfTextContent += `  Status: ${issue.status.replace("-", " ")}\n`;
        pdfTextContent += `  Priority: ${getPriorityLabel(issue.priority)}\n`;
        pdfTextContent += `  Assignee: ${issue.assignee.name}\n`;
        pdfTextContent += `  Created: ${new Date(issue.createdAt).toLocaleDateString()}\n`;
        if (issue.updatedAt) {
          pdfTextContent += `  Updated: ${new Date(issue.updatedAt).toLocaleDateString()}\n`;
        }
        if (issue.comments && issue.comments.length > 0) {
          pdfTextContent += `  Comments:\n`;
          issue.comments.forEach(comment => {
            pdfTextContent += `    - ${comment.author}: ${comment.text.substring(0, 100)}${comment.text.length > 100 ? '...' : ''}\n`;
          });
        }
        if (reportSettings.includePhotos && issue.images.length > 0) {
          pdfTextContent += `  Images: ${issue.images.length} image(s) noted. Full images in downloaded report.\n`;
        }
        pdfTextContent += `------------------------------------\n`;
      });
      content = pdfTextContent;
      type = "PDF (Text Preview)";
    } else if (activeTab === "csv") {
      const headers = [
        "#", "Title", "Assignee", "Status", "Priority", "Created", "Comments",
        ...(reportSettings.includeImagesInCSV ? ["Images (Count)"] : []),
      ];
      const rows = project.issues.map((issue, index) => [
        index + 1,
        issue.title,
        issue.assignee.name,
        issue.status.replace("-", " "),
        issue.priority,
        new Date(issue.createdAt).toLocaleDateString(),
        issue.comments ? issue.comments.map(c => c.text).join(" | ").substring(0,150) + (issue.comments.map(c => c.text).join(" | ").length > 150 ? "..." : "") : "",
        ...(reportSettings.includeImagesInCSV ? [issue.images.length.toString()] : []),
      ]);
      // For email body, we use a simpler format than strict CSV to avoid overly long lines with quotes
      content = headers.join("\t|\t") + "\n"; // Tab separated for readability in email
      content += rows.map(row => row.join("\t|\t")).join("\n");
      type = "CSV Data";
    } else {
      return { content: "No report content available for the selected tab.", type: "Error" };
    }
    return { content, type };
  };

  const handleEmail = () => {
    console.log("Email button clicked. Active tab:", activeTab);
    const subject = encodeURIComponent(`Site Audit Report: ${project.title}`);
    const { content: reportContent, type: reportType } = generateReportContentForEmail();

    if (reportType === "Error") {
      alert("Could not generate report content for email.");
      return;
    }
    
    let bodyIntro = `Hello,\n\nPlease find the ${reportType} for the Site Audit: ${project.title} (${project.reference}).\n\n`;
    let bodyReport = `------------------------------\n${reportType} Start\n------------------------------\n\n${reportContent}\n\n------------------------------\n${reportType} End\n------------------------------\n\n`;
    let bodyOutro = `Best regards,\n\n[Your Name/Company Name]\n\n`;
    let bodyNote = `IMPORTANT NOTE:\nThis email contains the report data directly in the body for quick reference.\n- For the fully formatted PDF or complete CSV file (especially if this content appears truncated or you need images), please use the 'Download' feature on the report preview page and attach the downloaded file to your email manually.\n- Email clients have limitations on the length of content that can be sent this way.`;

    let fullBody = bodyIntro + bodyReport + bodyOutro + bodyNote;
    let encodedBody = encodeURIComponent(fullBody);

    // Max URL length is ~2000. mailto:?subject=X&body=Y. Fixed part is ~20.
    // Give some buffer for subject. If encodedBody + encodedSubject > 1900, it's risky.
    if (encodedBody.length + subject.length > 1900) {
      console.warn("Email body might be too long and could be truncated by the email client. Sending a shorter version.");
      const shorterBodyContent = 
        `Hello,\n\nThe Site Audit Report for ${project.title} (${project.reference}) is ready.\n\n` +
        `The ${reportType} content was too extensive to include directly in this email body without risking truncation by email clients.\n\n` +
        `Please use the 'Download' feature on the report preview page to get the full report file, and then attach it to your email manually.\n\n` +
        `Best regards,\n\n[Your Name/Company Name]`;
      encodedBody = encodeURIComponent(shorterBodyContent);
    }
    
    window.location.href = `mailto:?subject=${subject}&body=${encodedBody}`;
  };


  const handlePrint = () => {
    console.log("Print button clicked.");
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Report Preview</h2>
          <p className="text-muted-foreground">
            Preview and customize your report before sharing
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isOptionsOpen} onOpenChange={setIsOptionsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Customize Report</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] h-[80vh]">
              <DialogHeader>
                <DialogTitle>Report Options</DialogTitle>
              </DialogHeader>
              <div className="h-full">
                <ReportOptions
                  onSave={handleSettingsChange}
                  onCancel={() => setIsOptionsOpen(false)}
                  onRegenerate={() => {
                    // Add logic for regenerating report if needed, e.g., re-fetch or re-process
                    console.log("Regenerate report based on settings:", reportSettings);
                    setIsOptionsOpen(false);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button> {/* Placeholder Share Button */}
            <ShareIcon className="mr-2 h-4 w-4" />
            Share Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pdf" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="csv">CSV</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <PrinterIcon className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmail}>
              <MailIcon className="mr-2 h-4 w-4" />
              Email
            </Button>
          </div>
        </div>

        <TabsContent value="pdf" className="space-y-6">
          <Card className="overflow-hidden">
            <div className="bg-primary text-primary-foreground p-8 text-center">
              <div className="mb-4">
                <img
                  src="https://github.com/polymet-ai.png"
                  alt="Company Logo"
                  className="h-16 mx-auto"
                />
              </div>
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-xl">{project.reference}</p>
              <p className="mt-4">
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-2">Prepared by: Granville Auditing Co</p>
            </div>
            <CardContent className="p-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Project Summary</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Project Reference
                      </p>
                      <p className="font-medium">{project.reference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(project.date).toLocaleDateString()}</p>
                    </div>
                    {project.location && (
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Location
                        </p>
                        <p className="font-medium">{project.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Issues
                      </p>
                      <p className="font-medium">{project.issues.length}</p>
                    </div>
                  </div>
                </div>

                {project.client && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">
                      Client Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Client Name
                        </p>
                        <p className="font-medium">{getClientName(project.client)}</p>
                      </div>
                      {typeof project.client !== 'string' && project.client.contact && (
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Contact Person
                          </p>
                          <p className="font-medium">
                            {project.client.contact}
                          </p>
                        </div>
                      )}
                      {typeof project.client !== 'string' && project.client.email && (
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{project.client.email}</p>
                        </div>
                      )}
                      {typeof project.client !== 'string' && project.client.phone && (
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{project.client.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-bold mb-4">Issues</h2>
                  <div className="space-y-6">
                    {project.issues.map((issue, index) => (
                      <Card key={issue.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/50 py-3">
                          <CardTitle className="text-lg flex justify-between">
                            <span>
                              {index + 1}. {issue.title}
                            </span>
                            <span
                              className={`text-sm ${getPriorityColor(
                                issue.priority
                              )}`}
                            >
                              {getPriorityLabel(issue.priority)}
                            </span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Assigned To
                              </p>
                              <p className="font-medium">
                                {issue.assignee.name}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Status
                              </p>
                              <p
                                className={`font-medium capitalize ${getStatusColor(
                                  issue.status
                                )}`}
                              >
                                {issue.status.replace("-", " ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">
                                Created
                              </p>
                              <p className="font-medium">
                                {new Date(issue.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            {issue.updatedAt && (
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Updated
                                </p>
                                <p className="font-medium">
                                  {new Date(
                                    issue.updatedAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>

                          {issue.comments && issue.comments.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm text-muted-foreground mb-1">
                                Comments
                              </p>
                              {issue.comments.map((comment) => (
                                <p key={comment.id} className="text-sm mb-1">
                                  <span className="font-medium">{comment.author}:</span> {comment.text}
                                </p>
                              ))}
                            </div>
                          )}

                          {reportSettings.includePhotos &&
                            issue.images.length > 0 && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Images
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {issue.images.map((image, imgIndex) => (
                                    <div
                                      key={imgIndex}
                                      className="border rounded-md overflow-hidden"
                                    >
                                      <img
                                        src={image.url}
                                        alt={`${issue.title} - Image ${
                                          imgIndex + 1
                                        }`}
                                        className="w-full h-auto"
                                      />

                                      {reportSettings.includeTimestamps &&
                                        image.timestamp && (
                                          <div className="p-2 text-xs text-muted-foreground">
                                            {new Date(
                                              image.timestamp
                                            ).toLocaleString()}
                                            {image.location?.address &&
                                              ` • ${image.location.address}`}
                                          </div>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-4 text-center text-sm text-muted-foreground">
              <div className="w-full">
                <p>
                  Generated with Site Audit Pro •{" "}
                  {new Date().toLocaleDateString()}
                </p>
                {reportSettings.includePageNumbers && (
                  <p className="mt-1">
                    {reportSettings.customWordings?.page || "Page"}{" "}
                    {/* Assuming page count is dynamic, placeholder 1 for now */}
                    1 {reportSettings.customWordings?.pageSeparator || "of"} 1
                  </p>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="csv">
          <Card>
            <CardHeader>
              <CardTitle>CSV Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">#</th>
                      <th className="text-left p-2">Title</th>
                      <th className="text-left p-2">Assignee</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Priority</th>
                      <th className="text-left p-2">Created</th>
                      <th className="text-left p-2">Comments</th>
                      {reportSettings.includeImagesInCSV && (
                        <th className="text-left p-2">Images (Count)</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {project.issues.map((issue, index) => (
                      <tr key={issue.id} className="border-b">
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{issue.title}</td>
                        <td className="p-2">{issue.assignee.name}</td>
                        <td className="p-2 capitalize">
                          {issue.status.replace("-", " ")}
                        </td>
                        <td className="p-2 capitalize">{issue.priority}</td>
                        <td className="p-2">
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          {issue.comments && issue.comments.length > 0
                            ? issue.comments.map(c => c.text).join(" | ").substring(0, 50) +
                              (issue.comments.map(c => c.text).join(" | ").length > 50 ? "..." : "")
                            : ""}
                        </td>
                        {reportSettings.includeImagesInCSV && (
                          <td className="p-2">
                            {issue.images.length > 0
                              ? `${issue.images.length}`
                              : "0"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>
                  Note: The actual CSV file will contain all data in a
                  spreadsheet-compatible format.
                </p>
                {reportSettings.includeImagesInCSV && (
                  <p className="mt-2">
                    If "Include Images in Export" is enabled in Report Options, image data (like counts or links, depending on full implementation) would be part of the export. For this preview, we show counts.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
