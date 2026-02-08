<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIssues } from '@/context/IssueContext';
import { issueService } from '@/services/api'; // Direct service use for history/images
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusTimeline } from '@/components/StatusTimeline';
import { ImageUpload } from '@/components/ImageUpload';
import { StatusBadge, SeverityBadge } from '@/components/ui/StatusBadge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function IssueDetails() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { getIssueById, updateIssueStatus } = useIssues();

   // We might want to fetch fresh data here including history/images
   // For now let's use context + local state for extras
   const issue = getIssueById(id || '');

   const [history, setHistory] = useState<any[]>([]);
   const [isLoadingHistory, setIsLoadingHistory] = useState(false);

   useEffect(() => {
      if (id) {
         loadHistory();
      }
   }, [id]);

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

   const handleImageUpload = async (file: File) => {
      if (!id) return;
      try {
         await issueService.uploadImage(id, file);
         toast.success('Image uploaded successfully');
         // ideally reload images
      } catch (error) {
         toast.error('Failed to upload image');
      }
   };

   if (isLoadingHistory || !issue) { // Simple check, ideally check context isLoading
      if (!issue) {
         return (
            <Layout>
               <div className="container mx-auto p-4 flex justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin" />
               </div>
            </Layout>
         );
      }
      // If issue exists but history is loading, we can still show the issue details
      // but the timeline will show its own loading state.
      // This block is primarily for when the issue itself is not found or still loading.
      // If we reach here and !issue is false, it means isLoadingHistory is true,
      // but the issue object is available, so we proceed to render the issue.
   }

   return (
      <Layout>
         <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
               <ArrowLeft className="h-4 w-4 mr-2" />
               Back
            </Button>

            <div className="grid gap-6">
               {/* Main Details */}
               <Card>
                  <CardHeader>
                     <div className="flex justify-between items-start">
                        <div>
                           <h1 className="text-2xl font-bold">{issue.title}</h1>
                           <p className="text-muted-foreground">ID: {issue.complaintNumber}</p>
                        </div>
                        <StatusBadge status={issue.status} />
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <p>{issue.description}</p>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                           <span className="font-semibold text-muted-foreground mr-2">Category:</span>
                           {issue.category}
                        </div>
                        <div>
                           <span className="font-semibold text-muted-foreground mr-2">Severity:</span>
                           <SeverityBadge severity={issue.severity} />
                        </div>
                        <div>
                           <span className="font-semibold text-muted-foreground mr-2">Address:</span>
                           {issue.address}
                        </div>

                        {/* Assignment Details */}
                        {issue.assigneeName && (
                           <>
                              <div className="md:col-span-2 border-t pt-2 mt-2">
                                 <h4 className="font-semibold mb-2">Assignment Details</h4>
                              </div>
                              <div>
                                 <span className="font-semibold text-muted-foreground mr-2">Assigned To:</span>
                                 {issue.assigneeName}
                              </div>
                              {issue.assigneeMobile && (
                                 <div>
                                    <span className="font-semibold text-muted-foreground mr-2">Contact:</span>
                                    {issue.assigneeMobile}
                                 </div>
                              )}
                              {issue.expectedCompletionDays && (
                                 <div>
                                    <span className="font-semibold text-muted-foreground mr-2">Est. Completion:</span>
                                    {issue.expectedCompletionDays} days
                                 </div>
                              )}
                              {issue.deadlineDate && (
                                 <div>
                                    <span className="font-semibold text-muted-foreground mr-2">Deadline:</span>
                                    {new Date(issue.deadlineDate).toLocaleDateString()}
                                 </div>
                              )}
                              {issue.otherFacilities && (
                                 <div className="md:col-span-2">
                                    <span className="font-semibold text-muted-foreground mr-2">Facilities:</span>
                                    {issue.otherFacilities}
                                 </div>
                              )}
                           </>
                        )}

                        {!issue.assigneeName && (
                           <div>
                              <span className="font-semibold text-muted-foreground mr-2">Assigned To:</span>
                              Unassigned
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>

               <div className="grid md:grid-cols-2 gap-6">
                  {/* Timeline */}
                  <Card>
                     <CardContent className="pt-6">
                        <StatusTimeline history={history} />
                     </CardContent>
                  </Card>

                  {/* Evidence */}
                  <Card>
                     <CardHeader>
                        <CardTitle>Evidence</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <ImageUpload onUpload={handleImageUpload} currentImages={issue.images} />
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </Layout>
   );
}
=======
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useIssues } from '@/context/IssueContext';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge, SeverityBadge } from '@/components/ui/StatusBadge';
import { ArrowLeft, MapPin, Calendar, User, Phone, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IssueStatus } from '@/types';
import { Reveal } from '@/components/ui/Reveal';

export default function IssueDetails() {
   const { id } = useParams<{ id: string }>();
   const navigate = useNavigate();
   const { getIssueById, updateIssueStatus } = useIssues();
   const { isAdmin } = useAuth();

   const issue = getIssueById(id || '');

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

   const handleStatusChange = (newStatus: IssueStatus) => {
      if (id) {
         updateIssueStatus(id, newStatus);
      }
   };

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
                                       <span>ID: {issue.id.slice(0, 8)}</span>
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
                                          {format(issue.createdAt, 'PPP p')}
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </CardContent>
                        </Card>

                        {/* Status Timeline or Updates could go here */}
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
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                       <Phone className="h-3 w-3" />
                                       <span>+91 98*** *****</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                       <Mail className="h-3 w-3" />
                                       <span>{issue.userId.slice(0, 4)}***@example.com</span>
                                    </div>
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

// Helper component for icon
function AlertTriangle({ className }: { className?: string }) {
   return (
      <svg
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className={className}
      >
         <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
         <path d="M12 9v4" />
         <path d="M12 17h.01" />
      </svg>
   );
}
>>>>>>> 0251dfea8c914f952057908c07daaf9cec5b8ee2
