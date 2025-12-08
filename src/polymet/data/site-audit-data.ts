export interface Assignee {
  name: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface BoundingBox {
  box_2d: [number, number, number, number]; // ymin, xmin, ymax, xmax (0-1000 scale)
  label: string;
  description: string;
  color?: string;
}

export interface Image {
  url: string;
  caption?: string;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  timestamp?: string;
  boundingBoxes?: BoundingBox[];
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  category: string;
  assignee: Assignee;
  createdAt: string;
  updatedAt?: string;
  comments?: Comment[];
  images: Image[];
  priority: "low" | "medium" | "high";
}

export interface Client {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
}

export interface Project {
  id: string;
  title: string;
  client?: string | Client; // Can be string or Client object
  date: string;
  status: "Completed" | "In Progress" | "Pending";
  progress: number;
  thumbnail?: string;
  issues: Issue[];
  reference?: string;
  location?: string;
  issueCount?: number;
  notes?: string;
}

export const PROJECTS: Project[] = [];

export const DEFAULT_APP_SETTINGS = {
  companyLogo: "https://github.com/shadcn.png",
  auditorCompany: "Granville Auditing Co",
  auditorName: "John Doe",
  customWordings: {
    issue: "Issue",
    issues: "Issues",
    identified: "Identified",
    preparedFor: "Prepared For",
  },
};

export const DEFAULT_REPORT_SETTINGS = {
  includePhotos: true,
  includeFrontCover: true,
  includeTimestamps: false,
  includePageNumbers: true,
  theme: "bright",
  photoSize: "regular",
  textSize: "regular",
  photoQuality: 80,
  includeImagesInCSV: false,
};

export const addIssueToProject = (projectId: string, issue: Issue) => {
  const project = PROJECTS.find(p => p.id === projectId);
  if (project) {
    project.issues.unshift(issue);
    project.issueCount = (project.issueCount || 0) + 1;
  }
};
