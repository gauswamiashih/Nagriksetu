import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Issue } from "@/types";

interface AssignmentDialogProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   issue: Issue | null;
   onAssign: (issueId: string, data: any) => Promise<void>;
}

export function AssignmentDialog({
   open,
   onOpenChange,
   issue,
   onAssign,
}: AssignmentDialogProps) {
   const [assignData, setAssignData] = useState({
      assigneeName: "",
      assigneeMobile: "",
      expectedCompletionDays: "",
      otherFacilities: "",
      deadlineDate: "",
   });
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      if (issue && open) {
         setAssignData({
            assigneeName: issue.assigneeName || "",
            assigneeMobile: issue.assigneeMobile || "",
            expectedCompletionDays: issue.expectedCompletionDays
               ? String(issue.expectedCompletionDays)
               : "",
            otherFacilities: issue.otherFacilities || "",
            deadlineDate: issue.deadlineDate
               ? new Date(issue.deadlineDate).toISOString().split("T")[0]
               : "",
         });
      }
   }, [issue, open]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!issue) return;

      setIsSubmitting(true);
      try {
         await onAssign(issue.id, {
            assignee_name: assignData.assigneeName,
            assignee_mobile: assignData.assigneeMobile,
            expected_completion_days: assignData.expectedCompletionDays
               ? parseInt(assignData.expectedCompletionDays)
               : null,
            other_facilities: assignData.otherFacilities,
            deadline_date: assignData.deadlineDate
               ? new Date(assignData.deadlineDate)
               : null,
         });
         onOpenChange(false);
      } catch (error) {
         console.error("Failed to assign:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
               <DialogTitle>Assign Issue</DialogTitle>
               <DialogDescription>
                  Assign the issue to an official and set a deadline.
               </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assigneeName" className="text-right">
                     Assignee
                  </Label>
                  <Input
                     id="assigneeName"
                     value={assignData.assigneeName}
                     onChange={(e) =>
                        setAssignData({ ...assignData, assigneeName: e.target.value })
                     }
                     className="col-span-3"
                     required
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assigneeMobile" className="text-right">
                     Mobile
                  </Label>
                  <Input
                     id="assigneeMobile"
                     value={assignData.assigneeMobile}
                     onChange={(e) =>
                        setAssignData({ ...assignData, assigneeMobile: e.target.value })
                     }
                     className="col-span-3"
                     required
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="days" className="text-right">
                     Est. Days
                  </Label>
                  <Input
                     id="days"
                     type="number"
                     value={assignData.expectedCompletionDays}
                     onChange={(e) =>
                        setAssignData({
                           ...assignData,
                           expectedCompletionDays: e.target.value,
                        })
                     }
                     className="col-span-3"
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deadline" className="text-right">
                     Deadline
                  </Label>
                  <Input
                     id="deadline"
                     type="date"
                     value={assignData.deadlineDate}
                     onChange={(e) =>
                        setAssignData({ ...assignData, deadlineDate: e.target.value })
                     }
                     className="col-span-3"
                  />
               </div>
               <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facilities" className="text-right">
                     Facilities
                  </Label>
                  <Textarea
                     id="facilities"
                     value={assignData.otherFacilities}
                     onChange={(e) =>
                        setAssignData({ ...assignData, otherFacilities: e.target.value })
                     }
                     className="col-span-3"
                  />
               </div>
               <DialogFooter>
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                  >
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Saving..." : "Save Assignment"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}
