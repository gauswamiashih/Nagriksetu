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
