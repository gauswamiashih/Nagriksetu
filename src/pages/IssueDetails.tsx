import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIssues } from '@/context/IssueContext';
import { useAuth } from '@/context/AuthContext';
import { issueService } from '@/services/api';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, SeverityBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IssueStatus } from '@/types';
import { Reveal } from '@/components/ui/Reveal';
import { StatusTimeline } from '@/components/StatusTimeline';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from 'sonner';

export default function IssueDetails() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { getIssueById, updateIssueStatus } = useIssues();
   const { isAdmin } = useAuth();

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [history, setHistory] = useState<any[]>([]);
   const [isLoadingHistory, setIsLoadingHistory] = useState(false);

   const issue = getIssueById(id || '');

   useEffect(() => {
      const loadHistory = async () => {
         if (!id) return;
         setIsLoadingHistory(true);
         try {
            const data = await issueService.getHistory(id);
            setHistory(data);
         } catch (error) {
            console.error('Failed to load history', error);
         } finally {
            setIsLoadingHistory(false);
         }
      };

      if (id) {
         loadHistory();
      }
   }, [id]);

   const handleImageUpload = async (file: File) => {
      if (!id) return;
      try {
         await issueService.uploadImage(id, file);
         toast.success('Image uploaded successfully');
         // In a real app we might reload the issue or images here
      } catch (error) {
         toast.error('Failed to upload image');
      }
   };

   const handleStatusChange = (newStatus: IssueStatus) => {
      if (id) {
         updateIssueStatus(id, newStatus);
      }
   };

   if (!issue) {
      return (
         <Layout>
            <div className="container mx-auto px-4 py-16 text-center">
               <h1 className="text-2xl font-bold mb-4">Complaint Not Found</h1>
               <p className="text-muted-foreground mb-8">The complaint you are looking for does not exist or has been removed.</p>
               <Button asChild>
                  <Link to="/dashboard">Back to Dashboard</Link>
               </Button>
            </div>
         </Layout>
      );
   }

   return (
      <Layout>
         <div className="bg-muted/30 min-h-screen py-8">
            <div className="container mx-auto px-4">
               <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="mb-6 hover:bg-background"
               >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
               </Button>

               <Reveal>
                  <div className="grid md:grid-cols-3 gap-6">
                     {/* Main Content */}
                     <div className="md:col-span-2 space-y-6">
                        <Card className="overflow-hidden border-none shadow-lg">
                           {issue.imageUrl && (
                              <div className="h-64 md:h-80 w-full overflow-hidden">
                                 <img
                                    src={issue.imageUrl}
                                    alt={issue.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                 />
                              </div>
                           )}
                           <CardHeader>
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                 <div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                       <span className="capitalize bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                          {issue.category}
                                       </span>
                                       <span>•</span>
                                       <span>ID: {issue.complaintNumber || issue.id.slice(0, 8)}</span>
                                    </div>
                                    <CardTitle className="text-2xl md:text-3xl font-display">
                                       {issue.title}
                                    </CardTitle>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <StatusBadge status={issue.status} className="text-base px-3 py-1" />
                                 </div>
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-6">
                              <div>
                                 <h3 className="font-semibold mb-2">Description</h3>
                                 <p className="text-muted-foreground leading-relaxed">
                                    {issue.description}
                                 </p>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                                 <div className="flex items-start gap-3">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                       <p className="font-medium text-sm">Location</p>
                                       <p className="text-sm text-muted-foreground">{issue.address}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                       <p className="font-medium text-sm">Reported On</p>
                                       <p className="text-sm text-muted-foreground">
                                          {format(new Date(issue.createdAt), 'PPP p')}
                                       </p>
                                    </div>
                                 </div>
                              </div>

                              {/* Assignment Details Block */}
                              {issue.assigneeName && (
                                 <div className="pt-4 border-t">
                                    <h4 className="font-semibold mb-3">Assignment Details</h4>
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                       <div>
                                          <span className="font-medium text-muted-foreground">Assigned To:</span>
                                          <div className="mt-1">{issue.assigneeName}</div>
                                       </div>
                                       {issue.assigneeMobile && (
                                          <div>
                                             <span className="font-medium text-muted-foreground">Contact:</span>
                                             <div className="mt-1">{issue.assigneeMobile}</div>
                                          </div>
                                       )}
                                       {issue.expectedCompletionDays && (
                                          <div>
                                             <span className="font-medium text-muted-foreground">Est. Completion:</span>
                                             <div className="mt-1">{issue.expectedCompletionDays} days</div>
                                          </div>
                                       )}
                                       {issue.deadlineDate && (
                                          <div>
                                             <span className="font-medium text-muted-foreground">Deadline:</span>
                                             <div className="mt-1">{new Date(issue.deadlineDate).toLocaleDateString()}</div>
                                          </div>
                                       )}
                                       {issue.otherFacilities && (
                                          <div className="sm:col-span-2">
                                             <span className="font-medium text-muted-foreground">Facilities:</span>
                                             <div className="mt-1">{issue.otherFacilities}</div>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              )}
                           </CardContent>
                        </Card>

                        {/* Status Timeline */}
                        <Card>
                           <CardContent className="pt-6">
                              <StatusTimeline history={history} />
                           </CardContent>
                        </Card>

                        {/* Evidence Upload */}
                        <Card>
                           <CardHeader>
                              <CardTitle>Evidence</CardTitle>
                           </CardHeader>
                           <CardContent>
                              <ImageUpload onUpload={handleImageUpload} currentImages={issue.images} />
                           </CardContent>
                        </Card>

                     </div>

                     {/* Sidebar Info */}
                     <div className="space-y-6">
                        {/* Admin Actions Card */}
                        {isAdmin && (
                           <Card className="border-l-4 border-l-primary shadow-md">
                              <CardHeader className="pb-3">
                                 <CardTitle className="text-lg">Admin Actions</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                 <div>
                                    <label className="text-sm font-medium mb-1.5 block">Update Status</label>
                                    <Select
                                       value={issue.status}
                                       onValueChange={(value) => handleStatusChange(value as IssueStatus)}
                                    >
                                       <SelectTrigger className="bg-background">
                                          <SelectValue />
                                       </SelectTrigger>
                                       <SelectContent>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="in-progress">In Progress</SelectItem>
                                          <SelectItem value="resolved">Resolved</SelectItem>
                                       </SelectContent>
                                    </Select>
                                 </div>
                                 <div className="pt-2 text-xs text-muted-foreground">
                                    <p>Changing status will notify the user.</p>
                                 </div>
                              </CardContent>
                           </Card>
                        )}

                        {/* Meta Info Card */}
                        <Card className="shadow-md">
                           <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Details</CardTitle>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Severity</span>
                                 </div>
                                 <SeverityBadge severity={issue.severity} />
                              </div>

                              <div className="pt-4 border-t">
                                 <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Reported By</span>
                                 </div>
                                 <p className="text-sm">{issue.userName}</p>
                                 <div className="mt-2 space-y-1">
                                    {issue.userId && (
                                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Mail className="h-3 w-3" />
                                          <span>{issue.userId.slice(0, 4)}***@example.com</span>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </CardContent>
                        </Card>
                     </div>
                  </div>
               </Reveal>
            </div>
         </div>
      </Layout>
   );
}
