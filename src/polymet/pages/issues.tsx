import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowUpDownIcon,
  ClipboardIcon,
  FilterIcon,
  PlusIcon,
} from "lucide-react";
import { PROJECTS, Issue } from "@/polymet/data/site-audit-data"; // Import Issue interface
import { Input } from "@/components/ui/input";
import IssueListItem from "@/polymet/components/issue-list-item";
import { useNavigate } from "react-router-dom";

export default function Issues() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  // Flatten all issues from all projects
  const allIssues = PROJECTS.flatMap((project) =>
    project.issues.map((issue) => ({
      ...issue,
      projectId: project.id,
      projectTitle: project.title,
    }))
  );

  const filteredIssues = allIssues.filter((issue) => {
    // Filter by status
    if (selectedTab !== "all" && issue.status !== selectedTab) return false;

    // Filter by priority
    if (priorityFilter !== "all" && issue.priority !== priorityFilter)
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !issue.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  // Sort issues
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "priority-high":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "priority-low":
        const priorityOrderReverse = { high: 1, medium: 2, low: 3 };
        return (
          priorityOrderReverse[b.priority] - priorityOrderReverse[a.priority]
        );

      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className="text-muted-foreground">
            Manage and track all site audit issues
          </p>
        </div>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Issue
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => setSelectedTab(value)}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search issues..."
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority-high">Highest Priority</SelectItem>
                <SelectItem value="priority-low">Lowest Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {sortedIssues.length} of {allIssues.length} issues
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <IssuesList issues={sortedIssues} />
        </TabsContent>
        <TabsContent value="open" className="mt-0">
          <IssuesList issues={sortedIssues} />
        </TabsContent>
        <TabsContent value="in-progress" className="mt-0">
          <IssuesList issues={sortedIssues} />
        </TabsContent>
        <TabsContent value="resolved" className="mt-0">
          <IssuesList issues={sortedIssues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface IssuesListProps {
  issues: Issue[];
}

function IssuesList({ issues }: IssuesListProps) {
  if (issues.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ClipboardIcon className="h-16 w-16 text-muted-foreground mb-4" />

          <h3 className="text-xl font-medium mb-2">No issues found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No issues match your current filters. Try adjusting your search or
            create a new issue.
          </p>
          <Button className="mt-6">Create New Issue</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <div key={issue.id} className="space-y-1">
          <div className="text-sm text-muted-foreground">
            {issue.projectTitle}
          </div>
          <IssueListItem
            title={issue.title}
            assignee={issue.assignee} // Directly pass the assignee object
            imageUrl={issue.images[0]?.url}
            status={issue.status}
            to={`/issue/${issue.projectId}/${issue.id}`}
          />
        </div>
      ))}
    </div>
  );
}
