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

export interface Image {
  url: string;
  caption?: string;
  location?: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  timestamp?: string;
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
}

export const PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Downtown Office Building",
    client: { name: "Urban Developments Inc." },
    date: "2023-10-26T10:00:00Z",
    status: "Completed",
    progress: 100,
    thumbnail: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    reference: "DOB-2023-10-26",
    location: "123 Main St, Anytown",
    issueCount: 3,
    issues: [
      {
        id: "issue-1",
        title: "HVAC System Malfunction",
        description:
          "The HVAC system on the 5th floor is not cooling properly, leading to uncomfortable temperatures.",
        status: "resolved",
        category: "Mechanical",
        assignee: { name: "Alice Johnson" },
        createdAt: "2023-10-20T09:30:00Z",
        updatedAt: "2023-10-25T14:15:00Z",
        comments: [
          {
            id: "comment-1",
            author: "John Doe",
            text: "Checked the refrigerant levels, they seem low. Scheduling a refill.",
            timestamp: "2023-10-21T11:00:00Z",
          },
        ],
        images: [
          {
            url: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "HVAC unit with visible frost.",
            location: { address: "5th Floor, Server Room" },
            timestamp: "2023-10-20T09:45:00Z",
          },
          {
            url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Thermostat reading 28°C.",
            location: { address: "5th Floor, Office 503" },
            timestamp: "2023-10-20T09:50:00Z",
          },
        ],
        priority: "high",
      },
      {
        id: "issue-2",
        title: "Leaky Roof Section",
        description:
          "Water stains observed on the ceiling tiles in the reception area after heavy rain.",
        status: "resolved",
        category: "Building Envelope",
        assignee: { name: "Bob Williams" },
        createdAt: "2023-10-22T11:00:00Z",
        updatedAt: "2023-10-26T09:00:00Z",
        comments: [],
        images: [
          {
            url: "https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Water stains on ceiling tile.",
            location: { address: "Ground Floor, Reception" },
            timestamp: "2023-10-22T11:15:00Z",
          },
        ],
        priority: "medium",
      },
      {
        id: "issue-3",
        title: "Faulty Elevator Sensor",
        description:
          "Elevator A occasionally stops between floors due to a sensor error.",
        status: "resolved",
        category: "Vertical Transport",
        assignee: { name: "Charlie Brown" },
        createdAt: "2023-10-23T14:00:00Z",
        updatedAt: "2023-10-26T10:30:00Z",
        comments: [],
        images: [
          {
            url: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Elevator control panel.",
            location: { address: "Elevator A" },
            timestamp: "2023-10-23T14:05:00Z",
          },
        ],
        priority: "high",
      },
    ],
  },
  {
    id: "proj-2",
    title: "Retail Store Renovation",
    client: { name: "Fashion Forward Co." },
    date: "2023-09-15T09:00:00Z",
    status: "In Progress",
    progress: 75,
    thumbnail: "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    reference: "RSR-2023-09-15",
    issueCount: 2,
    issues: [
      {
        id: "issue-4",
        title: "Incomplete Electrical Wiring",
        description:
          "Wiring for new display lighting is not up to code in Section B.",
        status: "in-progress",
        category: "Electrical",
        assignee: { name: "David Green" },
        createdAt: "2023-09-10T10:00:00Z",
        updatedAt: "2023-09-14T16:00:00Z",
        comments: [],
        images: [
          {
            url: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Exposed wiring in ceiling.",
            location: { address: "Section B, Apparel" },
            timestamp: "2023-09-10T10:10:00Z",
          },
        ],
        priority: "high",
      },
      {
        id: "issue-5",
        title: "Damaged Flooring Tiles",
        description:
          "Several floor tiles near the entrance are cracked and need replacement.",
        status: "in-progress",
        category: "Finishes",
        assignee: { name: "Eve White" },
        createdAt: "2023-09-12T13:00:00Z",
        updatedAt: "2023-09-15T11:00:00Z",
        comments: [],
        images: [
          {
            url: "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Cracked tile near main entrance.",
            location: { address: "Main Entrance" },
            timestamp: "2023-09-12T13:05:00Z",
          },
        ],
        priority: "medium",
      },
    ],
  },
  {
    id: "proj-3",
    title: "Warehouse Safety Audit",
    client: { name: "Global Logistics Corp." },
    date: "2023-08-01T14:00:00Z",
    status: "Completed",
    progress: 100,
    thumbnail: "https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    reference: "WSA-2023-08-01",
    issueCount: 1,
    issues: [
      {
        id: "issue-6",
        title: "Blocked Emergency Exit",
        description:
          "Boxes are obstructing the emergency exit on the west side of the warehouse.",
        status: "resolved",
        category: "Safety",
        assignee: { name: "Frank Black" },
        createdAt: "2023-07-28T09:00:00Z",
        updatedAt: "2023-07-31T17:00:00Z",
        comments: [],
        images: [
          {
            url: "https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Emergency exit blocked by crates.",
            location: { address: "Warehouse West Side" },
            timestamp: "2023-07-28T09:05:00Z",
          },
        ],
        priority: "high",
      },
    ],
  },
  {
    id: "proj-4",
    title: "Residential Complex Inspection",
    client: { name: "Harmony Homes Ltd." },
    date: "2023-11-01T09:00:00Z",
    status: "Pending",
    progress: 0,
    thumbnail: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    reference: "RCI-2023-11-01",
    issueCount: 0,
    issues: [],
  },
  {
    id: "proj-5",
    title: "School Building Assessment",
    client: { name: "District School Board" },
    date: "2023-11-05T11:00:00Z",
    status: "In Progress",
    progress: 20,
    thumbnail: "https://images.pexels.com/photos/265076/pexels-photo-265076.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    reference: "SBA-2023-11-05",
    issueCount: 1,
    issues: [
      {
        id: "issue-7",
        title: "Non-compliant Fire Extinguishers",
        description:
          "Several fire extinguishers are past their inspection date.",
        status: "in-progress",
        category: "Fire Safety",
        assignee: { name: "Grace Lee" },
        createdAt: "2023-11-02T10:00:00Z",
        updatedAt: "2023-11-03T15:00:00Z",
        comments: [],
        images: [
          {
            url: "https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
            caption: "Expired fire extinguisher tag.",
            location: { address: "Hallway near Gym" },
            timestamp: "2023-11-02T10:05:00Z",
          },
        ],
        priority: "high",
      },
    ],
  },
];

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
