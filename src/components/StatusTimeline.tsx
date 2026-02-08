import React from 'react';
import { IssueStatus } from '@/types';
import { format } from 'date-fns';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

interface TimelineEntry {
   status: IssueStatus;
   updatedAt: Date;
   updatedBy?: string;
   comment?: string;
}

interface StatusTimelineProps {
   history: TimelineEntry[];
}

export function StatusTimeline({ history }: StatusTimelineProps) {
   return (
      <div className="space-y-4">
         <h3 className="font-semibold text-lg">Status History</h3>
         <div className="relative border-l-2 border-muted ml-3 space-y-6">
            {history.map((entry, index) => (
               <div key={index} className="relative pl-6 pb-2">
                  <span className="absolute -left-[9px] top-1 bg-background p-1 rounded-full border">
                     {entry.status === 'resolved' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                     ) : entry.status === 'in-progress' ? (
                        <Clock className="h-4 w-4 text-blue-500" />
                     ) : (
                        <Circle className="h-4 w-4 text-gray-500" />
                     )}
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                     <span className="font-medium capitalize">{entry.status.replace('-', ' ')}</span>
                     <span className="text-xs text-muted-foreground">{format(new Date(entry.updatedAt), 'PPp')}</span>
                  </div>
                  {entry.updatedBy && <p className="text-sm text-muted-foreground">Updated by: {entry.updatedBy}</p>}
                  {entry.comment && <p className="text-sm mt-1 bg-muted/50 p-2 rounded">{entry.comment}</p>}
               </div>
            ))}
         </div>
      </div>
   );
}
