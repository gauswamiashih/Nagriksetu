import { Issue } from '@/types';
import { StatusBadge, SeverityBadge } from './StatusBadge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Eye, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

interface IssueCardProps {
  issue: Issue;
  showActions?: boolean;
  onViewDetails?: () => void;
}

const categoryIcons: Record<string, string> = {
  road: '🛣️',
  water: '💧',
  electricity: '⚡',
  garbage: '🗑️',
  drainage: '🚰',
  streetlight: '💡',
  other: '📋',
};

export function IssueCard({ issue, showActions = true, onViewDetails }: IssueCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {issue.imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <SeverityBadge severity={issue.severity} />
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryIcons[issue.category]}</span>
            <div>
              <h3 className="font-semibold text-base line-clamp-1">{issue.title}</h3>
              <p className="text-xs text-muted-foreground capitalize">{issue.category}</p>
            </div>
          </div>
          {!issue.imageUrl && <SeverityBadge severity={issue.severity} />}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {issue.description}
        </p>
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{issue.address}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDistanceToNow(issue.createdAt, { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between">
        <StatusBadge status={issue.status} />
        {showActions && (
          <Button
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
            onClick={onViewDetails}
            asChild
          >
            <Link to={`/issue/${issue.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
