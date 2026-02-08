import { cn } from '@/lib/utils';
import { IssueStatus, IssueSeverity } from '@/types';
import { getStatusConfig, getSeverityConfig } from '@/utils/calculateSeverity';

interface StatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

interface SeverityBadgeProps {
  severity: IssueSeverity;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const config = getSeverityConfig(severity);
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
