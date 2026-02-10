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
import { MapPin, Calendar, Eye, User } from "lucide-react";
import { StatusBadge, SeverityBadge } from "@/components/ui/StatusBadge";
import { Issue } from "@/types";

interface CitizenIssuesTableProps {
   issues: Issue[];
   isLoading: boolean;
}

export function CitizenIssuesTable({ issues, isLoading }: CitizenIssuesTableProps) {
   if (isLoading) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            Loading your reports...
         </div>
      );
   }

   if (issues.length === 0) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            No reports found.
         </div>
      );
   }

   return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-fade-in-up">
         <Table>
            <TableHeader className="bg-muted/50">
               <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[250px]">Issue</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {issues.map((issue) => (
                  <TableRow key={issue.id} className="hover:bg-muted/5 transition-colors">
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
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-secondary/10 text-secondary-foreground hover:bg-secondary/20 capitalize">
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
                        <div className="flex items-center gap-1.5 text-sm">
                           <User className="h-3.5 w-3.5 text-muted-foreground" />
                           {issue.assigneeName ? (
                              <span className="font-medium">{issue.assigneeName}</span>
                           ) : (
                              <span className="text-muted-foreground italic">Unassigned</span>
                           )}
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col text-xs text-muted-foreground">
                           <span>{format(new Date(issue.createdAt), "dd MMM yyyy")}</span>
                           <span>{format(new Date(issue.createdAt), "hh:mm a")}</span>
                        </div>
                     </TableCell>
                     <TableCell>
                        <SeverityBadge severity={issue.severity} />
                     </TableCell>
                     <TableCell>
                        <StatusBadge status={issue.status} />
                     </TableCell>
                     <TableCell className="text-right">
                        <Button
                           variant="ghost"
                           size="sm"
                           asChild
                           className="h-8 hover:bg-primary/10 hover:text-primary"
                        >
                           <Link to={`/issue/${issue.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                           </Link>
                        </Button>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
