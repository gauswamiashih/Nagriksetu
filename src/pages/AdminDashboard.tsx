import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { StatusBadge, SeverityBadge } from '@/components/ui/StatusBadge';
import { StatCard } from '@/components/ui/StatCard';
import { IssueStatus, IssueSeverity } from '@/types';
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Filter,
  MapPin,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { issues, updateIssueStatus, isLoading } = useIssues();
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    return matchesStatus && matchesSeverity;
  });

  // Stats
  const totalIssues = issues.length;
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const highSeverityCount = issues.filter(i => i.severity === 'high').length;

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    await updateIssueStatus(issueId, newStatus);
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage and resolve civic issues across Banaskantha District
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
              <Users className="h-4 w-4" />
              <span>Admin: {user.name}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                Filter Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="w-full sm:w-auto">
                  <label className="text-sm font-medium mb-1.5 block">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full sm:w-auto">
                  <label className="text-sm font-medium mb-1.5 block">Severity</label>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-background">
                      <SelectValue placeholder="All Severity" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStatusFilter('all');
                      setSeverityFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issues Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                All Issues ({filteredIssues.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading issues...
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No issues match the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Issue</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIssues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium line-clamp-1">{issue.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {issue.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="capitalize text-sm">{issue.category}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="line-clamp-1 max-w-[150px]">{issue.address}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{issue.userName}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(issue.createdAt, 'dd MMM yyyy')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <SeverityBadge severity={issue.severity} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={issue.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={issue.status}
                              onValueChange={(value) => handleStatusChange(issue.id, value as IssueStatus)}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-popover">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
