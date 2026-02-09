import { Issue, IssueStatus, IssueSeverity } from '@/types';
import { supabase } from '@/lib/supabase';

// Helper to map backend snake_case to frontend camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapIssueFromBackend = (data: any): Issue => {
   let categoryName = 'other';
   if (data.categories && data.categories.name) {
      categoryName = data.categories.name.toLowerCase();
   }

   let category: any = 'other';
   if (categoryName.includes('road')) category = 'road';
   else if (categoryName.includes('water')) category = 'water';
   else if (categoryName.includes('sanitation') || categoryName.includes('garbage')) category = 'garbage';
   else if (categoryName.includes('elect')) category = 'electricity';
   else if (categoryName.includes('light')) category = 'streetlight';
   else if (categoryName.includes('drain')) category = 'water';
   else if (categoryName.includes('safe')) category = 'police';

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
      userName: data.users?.full_name || 'Citizen',
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
      images: data.complaint_images?.map((img: any) => img.image_url) || [], // Map joined images
      statusHistory: [],
   };
};

export const issueService = {
   getAll: async (): Promise<Issue[]> => {
      const { data, error } = await supabase
         .from('complaints')
         .select(`
        *,
        categories ( name ),
        users ( full_name ),
        complaint_images ( image_url )
      `)
         .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(mapIssueFromBackend);
   },

   getCategories: async (): Promise<{ id: string; name: string; description: string }[]> => {
      const { data, error } = await supabase
         .from('categories')
         .select('*');
      if (error) throw error;
      return data;
   },

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   create: async (issueData: any) => {
      // 1. Generate Complaint Number locally or trigger? 
      // Ideally user DB trigger, but for now let's hope DB trigger exists or we generate simple one
      // We will let the DB trigger handle complaint_number if it exists, otherwise it might be null initially
      // Or we rely on the backend logic we had. Since we are moving logic to frontend, we might miss the trigger if it was in Express.
      // However, the DB schema conversation showed a trigger "set_complaint_number", so we are good.

      const { data, error } = await supabase
         .from('complaints')
         .insert([
            {
               title: issueData.title,
               description: issueData.description,
               category_id: issueData.category_id,
               latitude: issueData.latitude,
               longitude: issueData.longitude,
               address: issueData.address,
               user_id: issueData.user_id,
               status: 'pending'
            }
         ])
         .select(`*, categories(name), users(full_name)`)
         .single();

      if (error) throw error;

      // Images are handled separately now (upload first, then insert)
      return mapIssueFromBackend(data);
   },

   updateStatus: async (id: string, status: IssueStatus) => {
      const { data, error } = await supabase
         .from('complaints')
         .update({ status: status })
         .eq('id', id)
         .select(`*, categories(name), users(full_name)`)
         .single();

      if (error) throw error;
      return mapIssueFromBackend(data);
   },

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   assign: async (id: string, assignmentData: any) => {
      const { data, error } = await supabase
         .from('complaints')
         .update({
            assignee_name: assignmentData.assignee_name,
            assignee_mobile: assignmentData.assignee_mobile,
            expected_completion_days: assignmentData.expected_completion_days,
            other_facilities: assignmentData.other_facilities,
            deadline_date: assignmentData.deadline_date,
            assign_date: new Date(),
            status: 'in-progress',
            assigned_admin_id: assignmentData.assigned_admin_id // if available
         })
         .eq('id', id)
         .select(`*, categories(name), users(full_name)`)
         .single();

      if (error) throw error;
      return mapIssueFromBackend(data);
   },

   uploadImage: async (file: File) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
         .from('complaints')
         .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('complaints').getPublicUrl(filePath);
      return data.publicUrl;
   },

   // Add image record to DB (after upload)
   addImageRecord: async (complaintId: string, imageUrl: string) => {
      const { data, error } = await supabase
         .from('complaint_images')
         .insert([
            { complaint_id: complaintId, image_url: imageUrl }
         ])
         .select();

      if (error) throw error;
      return data;
   },

   getHistory: async (id: string) => {
      const { data, error } = await supabase
         .from('status_history')
         .select('*')
         .eq('complaint_id', id)
         .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
   }
};
