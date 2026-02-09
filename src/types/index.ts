export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'citizen' | 'admin';
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export type IssueCategory =
  | 'road'
  | 'water'
  | 'electricity'
  | 'garbage'
  | 'drainage'
  | 'streetlight'
  | 'other';

export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IssueStatus = 'pending' | 'in-progress' | 'resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  imageUrl?: string;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  userId: string;
  userName: string;
  status: IssueStatus;
  severity: IssueSeverity;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  complaintNumber?: string;
  assigneeName?: string;
  assigneeMobile?: string;
  expectedCompletionDays?: number;
  otherFacilities?: string;
  assignDate?: Date;
  deadlineDate?: Date;
  assignedTo?: string; // Kept for backward compatibility or internal user ID ref
  estimatedResolutionDate?: Date;
  images?: string[];
  imageFile?: File;
  statusHistory?: {
    status: IssueStatus;
    updatedAt: Date;
    updatedBy?: string;
    comment?: string;
  }[];
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

export interface IssueContextType {
  issues: Issue[];
  userIssues: Issue[];
  isLoading: boolean;
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'severity' | 'status'> & { category_id?: string }) => Promise<Issue>;
  updateIssueStatus: (issueId: string, status: IssueStatus) => Promise<void>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  assignIssue: (issueId: string, data: any) => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
}
