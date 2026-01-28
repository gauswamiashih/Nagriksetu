import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Issue, IssueContextType, IssueStatus } from '@/types';
import { useAuth } from './AuthContext';
import { calculateSeverity } from '@/utils/calculateSeverity';
import { toast } from 'sonner';

const IssueContext = createContext<IssueContextType | undefined>(undefined);

const ISSUES_STORAGE_KEY = 'nagriksetu_issues';

// Sample mock data for demonstration
const SAMPLE_ISSUES: Issue[] = [
  {
    id: 'issue_1',
    title: 'Large pothole on main road',
    description: 'There is a dangerous pothole near the bus stand that has caused multiple accidents. Urgent repair needed.',
    category: 'road',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    latitude: 24.1760,
    longitude: 72.4380,
    address: 'Near Bus Stand, Palanpur',
    district: 'Banaskantha',
    userId: 'sample_user_1',
    userName: 'Ramesh Patel',
    status: 'pending',
    severity: 'high',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'issue_2',
    title: 'Water supply disruption',
    description: 'No water supply in our area for the past 3 days. Residents are facing severe difficulties.',
    category: 'water',
    latitude: 24.1750,
    longitude: 72.4320,
    address: 'Sector 5, Deesa',
    district: 'Banaskantha',
    userId: 'sample_user_2',
    userName: 'Meena Sharma',
    status: 'in-progress',
    severity: 'high',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: 'issue_3',
    title: 'Street lights not working',
    description: 'Multiple street lights in the colony are not functioning, making it unsafe at night.',
    category: 'streetlight',
    latitude: 24.1800,
    longitude: 72.4400,
    address: 'Gandhi Nagar, Dhanera',
    district: 'Banaskantha',
    userId: 'sample_user_1',
    userName: 'Ramesh Patel',
    status: 'resolved',
    severity: 'low',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-13'),
    resolvedAt: new Date('2024-01-13'),
  },
  {
    id: 'issue_4',
    title: 'Garbage pile near school',
    description: 'Large garbage pile has accumulated near the primary school. Bad smell and health hazard.',
    category: 'garbage',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
    latitude: 24.1720,
    longitude: 72.4350,
    address: 'Near Primary School, Tharad',
    district: 'Banaskantha',
    userId: 'sample_user_3',
    userName: 'Suresh Kumar',
    status: 'pending',
    severity: 'medium',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
  },
];

function getStoredIssues(): Issue[] {
  const stored = localStorage.getItem(ISSUES_STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    return parsed.map((issue: Issue & { createdAt: string; updatedAt: string }) => ({
      ...issue,
      createdAt: new Date(issue.createdAt),
      updatedAt: new Date(issue.updatedAt),
      resolvedAt: issue.resolvedAt ? new Date(issue.resolvedAt) : undefined,
    }));
  }
  // Initialize with sample data
  localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(SAMPLE_ISSUES));
  return SAMPLE_ISSUES;
}

function saveIssues(issues: Issue[]) {
  localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
}

export function IssueProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIssues(getStoredIssues());
    setIsLoading(false);
  }, []);

  const userIssues = user 
    ? issues.filter(issue => issue.userId === user.id)
    : [];

  const createIssue = async (
    issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'severity' | 'status'>
  ) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const severity = calculateSeverity(
        issueData.category,
        issueData.title,
        issueData.description
      );

      const newIssue: Issue = {
        ...issueData,
        id: `issue_${Date.now()}`,
        status: 'pending',
        severity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedIssues = [newIssue, ...issues];
      setIssues(updatedIssues);
      saveIssues(updatedIssues);
      
      toast.success('Issue reported successfully!');
    } catch (error) {
      toast.error('Failed to create issue');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssueStatus = async (issueId: string, status: IssueStatus) => {
    try {
      const updatedIssues = issues.map(issue => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status,
            updatedAt: new Date(),
            resolvedAt: status === 'resolved' ? new Date() : issue.resolvedAt,
          };
        }
        return issue;
      });

      setIssues(updatedIssues);
      saveIssues(updatedIssues);
      toast.success(`Issue status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update issue status');
      throw error;
    }
  };

  const getIssueById = (id: string) => issues.find(issue => issue.id === id);

  return (
    <IssueContext.Provider value={{
      issues,
      userIssues,
      isLoading,
      createIssue,
      updateIssueStatus,
      getIssueById,
    }}>
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
}
