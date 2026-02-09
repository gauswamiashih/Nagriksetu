import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Issue, IssueContextType, IssueStatus } from '@/types';
import { useAuth } from './AuthContext';
import { calculateSeverity } from '@/utils/calculateSeverity';
import { toast } from 'sonner';
import { issueService } from '@/services/api';

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export function IssueProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const data = await issueService.getAll();
      setIssues(data);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      toast.error('Failed to load issues');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const userIssues = user
    ? issues.filter(issue => issue.userId === user.id)
    : [];

  const createIssue = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    issueData: any
  ): Promise<Issue> => {
    setIsLoading(true);
    try {
      // API call to create issue
      // We pass userId from auth context if available, otherwise it comes from issueData
      const payload = {
        ...issueData,
        user_id: user?.id || issueData.userId,
      };

      const newIssue = await issueService.create(payload);
      setIssues([newIssue, ...issues]);
      toast.success('Issue reported successfully!');
      return newIssue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Create issue error:', error);
      if (error.response) {
        console.error('Server Error Response:', error.response.data);
        if (error.response.data.error?.includes('foreign key constraint')) {
          toast.error('Session expired. Please log out and log in again.');
          throw error;
        }
      }
      toast.error(error.response?.data?.error || 'Failed to create issue');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssueStatus = async (issueId: string, status: IssueStatus) => {
    try {
      const updatedIssue = await issueService.updateStatus(issueId, status);

      setIssues(issues.map(issue =>
        issue.id === issueId ? updatedIssue : issue
      ));

      toast.success(`Issue status updated to ${status}`);
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update issue status');
      throw error;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const assignIssue = async (issueId: string, data: any) => {
    try {
      const updatedIssue = await issueService.assign(issueId, data);

      setIssues(issues.map(issue =>
        issue.id === issueId ? updatedIssue : issue
      ));

      toast.success('Issue assigned successfully');
    } catch (error) {
      console.error('Assign issue error:', error);
      toast.error('Failed to assign issue');
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
      assignIssue,
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
