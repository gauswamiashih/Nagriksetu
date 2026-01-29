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
