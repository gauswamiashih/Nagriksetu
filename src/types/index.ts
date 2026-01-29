export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'citizen' | 'admin';
  createdAt: Date;
}

export type IssueCategory =
  | 'road'
  | 'water'
  | 'electricity'
  | 'garbage'
  | 'drainage'
  | 'streetlight'
  | 'other';

export type IssueSeverity = 'low' | 'medium' | 'high';

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
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'severity' | 'status'>) => Promise<void>;
  updateIssueStatus: (issueId: string, status: IssueStatus) => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
}
