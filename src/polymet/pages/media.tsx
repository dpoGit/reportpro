import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckIcon,
  DownloadIcon,
  FilterIcon,
  FolderIcon,
  ImageIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { PROJECTS } from "@/polymet/data/site-audit-data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Media() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [mediaItems, setMediaItems] = useState(() => {
    // Initialize mediaItems from PROJECTS data
    return PROJECTS.flatMap((project) =>
      project.issues.flatMap((issue) =>
        issue.images.map((image, imageIndex) => ({
          ...image,
          // Generate a stable ID using project, issue, and image index
          id: `${project.id}-${issue.id}-${imageIndex}`,
          projectId: project.id,
          projectTitle: project.title,
          issueId: issue.id,
          issueTitle: issue.title,
          date: issue.createdAt,
        }))
      )
    );
  });

  // Create folders based on projects
  const folders = PROJECTS.map((project) => ({
    id: project.id,
    name: project.title,
    itemCount: project.issues.reduce(
      (acc, issue) => acc + issue.images.length,
      0
    ),
    date: project.date,
  }));

  const filteredMedia =
    selectedTab === "all"
      ? mediaItems.filter((item) =>
          item.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : selectedTab === "folders"
        ? [] // Folders tab displays folders, not individual media items
        : mediaItems.filter((image) => {
            // For 'recent' tab, filter by date (last 7 days for example)
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return new Date(image.date) >= sevenDaysAgo &&
                   (image.issueTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    image.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()));
          });

  const handleItemSelect = (id: string, isChecked: boolean) => {
    setSelectedItems((prevSelectedItems) => {
      if (isChecked) {
        return [...prevSelectedItems, id];
      } else {
        return prevSelectedItems.filter((itemId) => itemId !== id);
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredMedia.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleNewFolder = () => {
    console.log("New Folder button clicked!");
    alert("New Folder functionality coming soon!");
  };

  const handleUpload = () => {
    console.log("Upload button clicked!");
    alert("Upload functionality coming soon!");
  };

  const handleDownloadSelected = () => {
    console.log("Download selected items:", selectedItems);
    alert(`Downloading ${selectedItems.length} items!`);
    // In a real app, you'd initiate a download for these items
  };

  const handleDeleteSelected = () => {
    console.log("Delete selected items:", selectedItems);
    if (window.confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      setMediaItems((prevMediaItems) =>
        prevMediaItems.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]); // Clear selection after deletion
      alert("Items deleted successfully!");
    }
  };

  const handleLocationClick = (location: string) => {
    alert(`Location: ${location}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">
            Manage and organize your site audit images
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleNewFolder}>
            <FolderIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={handleUpload}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={(value) => {
          setSelectedTab(value);
          setSearchQuery(""); // Clear search when changing tabs
          setSelectedItems([]); // Clear selection when changing tabs
        }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="folders">Folders</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Input
                placeholder="Search media..."
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

            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? (
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
                  <line x1="8" y1="6" x2="21" y2="6" />

                  <line x1="8" y1="12" x2="21" y2="12" />

                  <line x1="8" y1="18" x2="21" y2="18" />

                  <line x1="3" y1="6" x2="3.01" y2="6" />

                  <line x1="3" y1="12" x2="3.01" y2="12" />

                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              ) : (
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
                  <rect x="3" y="3" width="7" height="7" />

                  <rect x="14" y="3" width="7" height="7" />

                  <rect x="14" y="14" width="7" height="7" />

                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              )}
            </Button>

            <Button variant="outline" size="icon">
              <FilterIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between bg-muted p-2 rounded-md mb-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={
                  selectedItems.length === 0
                    ? false
                    : selectedItems.length === filteredMedia.length
                      ? true
                      : "indeterminate"
                }
                onCheckedChange={handleSelectAll}
                id="select-all"
              />

              <label htmlFor="select-all" className="text-sm">
                {selectedItems.length} selected
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadSelected}>
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        )}

        <TabsContent value="all" className="mt-0">
          {viewMode === "grid" ? (
            <MediaGrid
              items={filteredMedia}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onLocationClick={handleLocationClick}
            />
          ) : (
            <MediaList
              items={filteredMedia}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onLocationClick={handleLocationClick}
            />
          )}
        </TabsContent>

        <TabsContent value="folders" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {folders.map((folder) => (
              <Card key={folder.id} className="overflow-hidden transition-colors hover:bg-accent/50 hover:border-primary">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <FolderIcon className="h-5 w-5 mr-2 text-blue-500" />

                      {folder.name}
                    </CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Download All
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-red-600">
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {folder.itemCount} item{folder.itemCount !== 1 && "s"}
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/50 p-2 text-xs text-muted-foreground">
                  {new Date(folder.date).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          {viewMode === "grid" ? (
            <MediaGrid
              items={filteredMedia} // Use filteredMedia for recent, it's already filtered by date and search
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onLocationClick={handleLocationClick}
            />
          ) : (
            <MediaList
              items={filteredMedia} // Use filteredMedia for recent
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onLocationClick={handleLocationClick}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MediaGrid({ items, selectedItems, onItemSelect, onLocationClick }) {
  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />

          <h3 className="text-xl font-medium mb-2">No media found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No media items match your current filters. Try adjusting your search
            or upload new media.
          </p>
          <Button className="mt-6">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden transition-colors hover:bg-accent/50 hover:border-primary">
          <div className="relative aspect-square">
            <img
              src={item.url}
              alt={item.issueTitle}
              className="h-full w-full object-cover"
            />

            <div className="absolute top-2 left-2">
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) => onItemSelect(item.id, checked)}
                className="h-5 w-5 bg-white/80 backdrop-blur-sm"
              />
            </div>
            {item.location && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-2 left-2 h-auto px-2 py-1 rounded-full bg-black/60 text-white hover:bg-orange-500 hover:text-white"
                onClick={() => onLocationClick(item.location)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />

                  <circle cx="12" cy="10" r="3" />
                </svg>
                Location
              </Button>
            )}
          </div>
          <CardContent className="p-3">
            <p className="text-sm font-medium truncate">{item.issueTitle}</p>
            <p className="text-xs text-muted-foreground truncate">
              {item.projectTitle}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between p-3 pt-0">
            <p className="text-xs text-muted-foreground">
              {new Date(item.date).toLocaleDateString()}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-600">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function MediaList({ items, selectedItems, onItemSelect, onLocationClick }) {
  if (items.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />

          <h3 className="text-xl font-medium mb-2">No media found</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No media items match your current filters. Try adjusting your search
            or upload new media.
          </p>
          <Button className="mt-6">
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Media
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center border rounded-md overflow-hidden transition-colors hover:bg-accent/50 hover:border-primary"
        >
          <div className="flex items-center p-2">
            <Checkbox
              checked={selectedItems.includes(item.id)}
              onCheckedChange={(checked) => onItemSelect(item.id, checked)}
              className="mr-2"
            />
          </div>
          <div className="h-16 w-16 flex-shrink-0">
            <img
              src={item.url}
              alt={item.issueTitle}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1 p-3 min-w-0">
            <p className="font-medium truncate">{item.issueTitle}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="truncate">{item.projectTitle}</span>
              <span className="mx-2">•</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </div>
          {item.location && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 rounded-full bg-muted text-foreground hover:bg-orange-500 hover:text-white mr-4"
              onClick={() => onLocationClick(item.location)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />

                <circle cx="12" cy="10" r="3" />
              </svg>
              Location
            </Button>
          )}
          <div className="p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-red-600">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
}
