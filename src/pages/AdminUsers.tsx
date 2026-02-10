import { Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { StatCard } from '@/components/ui/StatCard';
import { UsersTable } from '@/components/admin/UsersTable';
import { IssuesTable } from '@/components/admin/IssuesTable';
import { useIssues } from '@/context/IssueContext';
import { AssignmentDialog } from '@/components/admin/AssignmentDialog';
import { Issue, IssueStatus } from '@/types';
import { Users as UsersIcon, User as UserIcon, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminUsers() {
   const { user, isAdmin } = useAuth();
   const { users, isLoading: isUsersLoading } = useUsers();
   const { issues, updateIssueStatus, assignIssue, isLoading: isIssuesLoading } = useIssues();

   const [assignDialogOpen, setAssignDialogOpen] = useState(false);
   const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

   const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
      try {
         await updateIssueStatus(issueId, newStatus);
      } catch (error) {
         toast.error("Failed to update status");
      }
   };

   const handleAssign = async (issueId: string, data: any) => {
      await assignIssue(issueId, data);
      setAssignDialogOpen(false);
      setSelectedIssue(null);
   };

   if (!user) {
      return <Navigate to="/login" replace />;
   }

   if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
   }

   // User Stats
   const totalUsers = users.length;
   const citizenCount = users.filter(u => u.role === 'citizen').length;
   const adminCount = users.filter(u => u.role === 'admin').length;

   return (
      <AdminLayout>
         <div className="space-y-8 animate-fade-in">
            <div>
               <h1 className="text-3xl font-display font-bold">User Directory</h1>
               <p className="text-muted-foreground">Manage registered users and administrators</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <StatCard
                  title="Total Users"
                  value={totalUsers}
                  icon={UsersIcon}
                  variant="primary"
               />
               <StatCard
                  title="Citizens"
                  value={citizenCount}
                  icon={UserIcon}
                  variant="secondary"
               />
               <StatCard
                  title="Admins"
                  value={adminCount}
                  icon={UsersIcon}
                  variant="accent"
               />
            </div>

            <UsersTable users={users} isLoading={isUsersLoading} />

            <div className="pt-8 border-t">
               <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                     <FileText className="h-6 w-6 text-primary" />
                     User Reports
                  </h2>
                  <p className="text-muted-foreground">All issues reported by registered users</p>
               </div>
               <IssuesTable
                  issues={issues}
                  isLoading={isIssuesLoading}
                  onAssign={(issue) => {
                     setSelectedIssue(issue);
                     setAssignDialogOpen(true);
                  }}
                  onStatusChange={handleStatusChange}
               />
            </div>

            <AssignmentDialog
               open={assignDialogOpen}
               onOpenChange={setAssignDialogOpen}
               issue={selectedIssue}
               onAssign={handleAssign}
            />
         </div>
      </AdminLayout>
   );
}
