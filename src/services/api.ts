import axios from 'axios';
import { Issue, IssueStatus, IssueSeverity } from '@/types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json',
   },
});

// Helper to map backend snake_case to frontend camelCase
const mapIssueFromBackend = (data: any): Issue => {
   // Map DB category name 'Water Supply' -> 'water', 'Roads' -> 'road'
   let category: any = 'other';
   if (data.category_name) {
      const lower = data.category_name.toLowerCase();
      if (lower.includes('road')) category = 'road';
      else if (lower.includes('water')) category = 'water';
      else if (lower.includes('sanitation')) category = 'garbage'; // mapping sanitation to garbage for now
      else if (lower.includes('elect')) category = 'electricity';
      else if (lower.includes('light')) category = 'streetlight';
   }

   return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: category,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      address: data.address,
      district: 'Banaskantha',
      userId: data.user_id,
      userName: data.user_name || 'Citizen',
      status: (data.status || 'pending').toLowerCase() as IssueStatus,
      severity: (data.severity || 'low').toLowerCase() as IssueSeverity,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      resolvedAt: data.resolved_at ? new Date(data.resolved_at) : undefined,
      complaintNumber: data.complaint_number,
      assignedTo: data.assigned_admin_id,
      assigneeName: data.assignee_name,
      assigneeMobile: data.assignee_mobile,
      expectedCompletionDays: data.expected_completion_days,
      otherFacilities: data.other_facilities,
      assignDate: data.assign_date ? new Date(data.assign_date) : undefined,
      deadlineDate: data.deadline_date ? new Date(data.deadline_date) : undefined,
      estimatedResolutionDate: data.estimated_resolution_date ? new Date(data.estimated_resolution_date) : undefined,
      images: [],
      statusHistory: [],
   };
};

export const issueService = {
   getAll: async (): Promise<Issue[]> => {
      const response = await api.get('/complaints');
      return response.data.map(mapIssueFromBackend);
   },

   getCategories: async (): Promise<{ id: string; name: string; description: string }[]> => {
      const response = await api.get('/categories');
      return response.data;
   },

   create: async (issueData: any) => {
      // Use FormData to support file upload
      const formData = new FormData();
      formData.append('title', issueData.title);
      formData.append('description', issueData.description);
      formData.append('category_id', issueData.category);
      formData.append('latitude', String(issueData.latitude));
      formData.append('longitude', String(issueData.longitude));
      formData.append('address', issueData.address);
      formData.append('user_id', issueData.userId);

      if (issueData.imageFile) {
         formData.append('image', issueData.imageFile);
      }

      const response = await api.post('/complaints', formData);
      return mapIssueFromBackend(response.data);
   },

   updateStatus: async (id: string, status: IssueStatus) => {
      const response = await api.patch(`/complaints/${id}/status`, { status });
      return mapIssueFromBackend(response.data);
   },

   assign: async (id: string, assignmentData: any) => {
      const response = await api.patch(`/complaints/${id}/assign`, assignmentData);
      return mapIssueFromBackend(response.data);
   },

   uploadImage: async (id: string, file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post(`/complaints/${id}/images`, formData, {
         headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
   },

   getHistory: async (id: string) => {
      const response = await api.get(`/complaints/${id}/history`);
      return response.data;
   }
};
