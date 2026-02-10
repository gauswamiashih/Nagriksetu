import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { IssuesTable } from '@/components/admin/IssuesTable';
import { AssignmentDialog } from '@/components/admin/AssignmentDialog';
import { IssueStatus, Issue } from '@/types';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminReports() {
   const { user, isAdmin } = useAuth();
   const { issues, updateIssueStatus, assignIssue, isLoading: isIssuesLoading } = useIssues();

   /* Assignment State */
   const [assignDialogOpen, setAssignDialogOpen] = useState(false);
   const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

   const [statusFilter, setStatusFilter] = useState<string>('all');
   const [severityFilter, setSeverityFilter] = useState<string>('all');

   if (!user) {
      return <Navigate to="/login" replace />;
   }

   if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
   }

   // Filter issues
   const filteredIssues = issues.filter(issue => {
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
      return matchesStatus && matchesSeverity;
   });

   const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
      try {
         await updateIssueStatus(issueId, newStatus);
         toast.success(`Issue marked as ${newStatus}`);
      } catch (error) {
         toast.error("Failed to update status");
      }
   };

   const handleAssign = async (issueId: string, data: any) => {
      await assignIssue(issueId, data);
      toast.success("Issue assigned successfully");
      setAssignDialogOpen(false);
      setSelectedIssue(null);
   };

   return (
      <AdminLayout>
         <div className="space-y-8 animate-fade-in">
            <div>
               <h1 className="text-3xl font-display font-bold">Reports & Complaints</h1>
               <p className="text-muted-foreground">Manage and resolve civic issues reported by citizens</p>
            </div>

            <div className="grid gap-6">
               <Card>
                  <CardHeader className="pb-4">
                     <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5 text-primary" />
                        Filter Issues
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-wrap gap-4">
                        <div className="w-full sm:w-auto">
                           <label className="text-sm font-medium mb-1.5 block">Status</label>
                           <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-full sm:w-[180px]">
                                 <SelectValue placeholder="All Status" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="all">All Status</SelectItem>
                                 <SelectItem value="pending">Pending</SelectItem>
                                 <SelectItem value="in-progress">In Progress</SelectItem>
                                 <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="w-full sm:w-auto">
                           <label className="text-sm font-medium mb-1.5 block">Severity</label>
                           <Select value={severityFilter} onValueChange={setSeverityFilter}>
                              <SelectTrigger className="w-full sm:w-[180px]">
                                 <SelectValue placeholder="All Severity" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="all">All Severity</SelectItem>
                                 <SelectItem value="high">High</SelectItem>
                                 <SelectItem value="medium">Medium</SelectItem>
                                 <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        <div className="flex items-end">
                           <Button
                              variant="ghost"
                              onClick={() => {
                                 setStatusFilter('all');
                                 setSeverityFilter('all');
                              }}
                           >
                              Reset
                           </Button>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <IssuesTable
                  issues={filteredIssues}
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
