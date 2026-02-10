import {
   FileText,
   Clock,
   TrendingUp,
   CheckCircle2,
   AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";

interface StatsGridProps {
   totalIssues: number;
   pendingCount: number;
   inProgressCount: number;
   resolvedCount: number;
   highSeverityCount: number;
}

export function StatsGrid({
   totalIssues,
   pendingCount,
   inProgressCount,
   resolvedCount,
   highSeverityCount,
}: StatsGridProps) {
   return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
         <StatCard
            title="Total Issues"
            value={totalIssues}
            icon={FileText}
            variant="secondary"
         />
         <StatCard
            title="Pending"
            value={pendingCount}
            icon={Clock}
            variant="default"
         />
         <StatCard
            title="In Progress"
            value={inProgressCount}
            icon={TrendingUp}
            variant="default"
         />
         <StatCard
            title="Resolved"
            value={resolvedCount}
            icon={CheckCircle2}
            variant="accent"
         />
         <StatCard
            title="High Priority"
            value={highSeverityCount}
            icon={AlertTriangle}
            variant="primary"
         />
      </div>
   );
}
