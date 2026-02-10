import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Calendar, CheckCircle2, Eye, User } from "lucide-react";
import { StatusBadge, SeverityBadge } from "@/components/ui/StatusBadge";
import { Issue, IssueStatus } from "@/types";

interface IssuesTableProps {
   issues: Issue[];
   isLoading: boolean;
   onAssign: (issue: Issue) => void;
   onStatusChange: (issueId: string, status: IssueStatus) => Promise<void>;
}

export function IssuesTable({
   issues,
   isLoading,
   onAssign,
   onStatusChange,
}: IssuesTableProps) {
   if (isLoading) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            Loading issues...
         </div>
      );
   }

   if (issues.length === 0) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            No issues match the selected filters.
         </div>
      );
   }

   return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
         <Table>
            <TableHeader>
               <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[250px]">Issue</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>ETA</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {issues.map((issue) => (
                  <TableRow key={issue.id} className="hover:bg-muted/5">
                     <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                        {issue.complaintNumber || "N/A"}
                     </TableCell>
                     <TableCell>
                        <div>
                           <p className="font-medium line-clamp-1">{issue.title}</p>
                           <p className="text-xs text-muted-foreground line-clamp-1">
                              {issue.description}
                           </p>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 capitalize">
                           {issue.category}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                           <MapPin className="h-3 w-3 shrink-0" />
                           <span className="line-clamp-1 max-w-[150px]" title={issue.address}>
                              {issue.address}
                           </span>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col text-sm">
                           {issue.assigneeName ? (
                              <span className="font-medium">{issue.assigneeName}</span>
                           ) : (
                              <span className="text-muted-foreground italic">Unassigned</span>
                           )}
                           {issue.assigneeMobile && (
                              <span className="text-xs text-muted-foreground">
                                 {issue.assigneeMobile}
                              </span>
                           )}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                           <Clock className="h-3 w-3 shrink-0" />
                           {issue.deadlineDate ? (
                              format(new Date(issue.deadlineDate), "dd MMM")
                           ) : (
                              <span>-</span>
                           )}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                           <Calendar className="h-3 w-3 shrink-0" />
                           {format(new Date(issue.createdAt), "dd MMM")}
                        </div>
                     </TableCell>
                     <TableCell>
                        <SeverityBadge severity={issue.severity} />
                     </TableCell>
                     <TableCell>
                        <StatusBadge status={issue.status} />
                     </TableCell>
                     <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                           <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="View Details"
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                           >
                              <Link to={`/issue/${issue.id}`}>
                                 <Eye className="h-4 w-4" />
                              </Link>
                           </Button>

                           <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => onAssign(issue)}
                              title="Assign Task"
                           >
                              <User className="h-3.5 w-3.5 mr-1" />
                              Assign
                           </Button>

                           {issue.status !== "resolved" && (
                              <Button
                                 size="sm"
                                 className="h-8 text-xs bg-green-600 hover:bg-green-700 text-white"
                                 onClick={() => onStatusChange(issue.id, "resolved")}
                                 title="Mark as Resolved"
                              >
                                 <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                 Resolve
                              </Button>
                           )}
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
