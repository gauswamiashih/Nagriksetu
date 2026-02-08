import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { useUsers } from '@/hooks/useUsers';
import { StatusBadge, SeverityBadge } from '@/components/ui/StatusBadge';
import { StatCard } from '@/components/ui/StatCard';
import { IssueStatus, Issue } from '@/types';
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
  User as UserIcon,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { issues, updateIssueStatus, isLoading: isIssuesLoading } = useIssues();
  const { users, isLoading: isUsersLoading } = useUsers();

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

  // Issue Stats
  const totalIssues = issues.length;
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const highSeverityCount = issues.filter(i => i.severity === 'high').length;

  /* Assignment State */
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignData, setAssignData] = useState({
    assigneeName: '',
    assigneeMobile: '',
    expectedCompletionDays: '',
    otherFacilities: '',
    deadlineDate: '',
  });

  const { assignIssue } = useIssues();

  // User Stats (Restored)
  const totalUsers = users.length;
  const citizenCount = users.filter(u => u.role === 'citizen').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  const handleStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    await updateIssueStatus(issueId, newStatus);
  };

  /* Assignment Handlers */
  const openAssignDialog = (issue: Issue) => {
    console.log('Opening assign dialog for issue:', issue);
    setSelectedIssue(issue);
    setAssignData({
      assigneeName: issue.assigneeName || '',
      assigneeMobile: issue.assigneeMobile || '',
      expectedCompletionDays: issue.expectedCompletionDays ? String(issue.expectedCompletionDays) : '',
      otherFacilities: issue.otherFacilities || '',
      deadlineDate: issue.deadlineDate ? new Date(issue.deadlineDate).toISOString().split('T')[0] : '',
    });
    setAssignDialogOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    console.log('Submitting assignment:', assignData);

    try {
      await assignIssue(selectedIssue.id, {
        assignee_name: assignData.assigneeName,
        assignee_mobile: assignData.assigneeMobile,
        expected_completion_days: assignData.expectedCompletionDays ? parseInt(assignData.expectedCompletionDays) : null,
        other_facilities: assignData.otherFacilities,
        deadline_date: assignData.deadlineDate ? new Date(assignData.deadlineDate) : null,
      });
      console.log('Assignment successful');
      setAssignDialogOpen(false);
      setSelectedIssue(null);
      // Optional: Add a success alert or toast if not already handled by context
      alert('Issue assigned successfully!');
    } catch (error: any) {
      console.error('Assignment failed:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
      alert(`Failed to assign issue: ${errorMessage}`);
    }
  };





  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 py-8">
          {/* ... Header ... */}
          {/* ... Assignment Dialog ... */}
          {assignDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <Card className="w-full max-w-md mx-4 animate-in fade-in zoom-in-95 duration-200">
                <CardHeader>
                  <CardTitle>Assign Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAssignSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assignee Name</label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        value={assignData.assigneeName}
                        onChange={e => setAssignData({ ...assignData, assigneeName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mobile Number</label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        value={assignData.assigneeMobile}
                        onChange={e => setAssignData({ ...assignData, assigneeMobile: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Expected Completion (Days)</label>
                      <input
                        type="number"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        value={assignData.expectedCompletionDays}
                        onChange={e => setAssignData({ ...assignData, expectedCompletionDays: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Deadline Date</label>
                      <input
                        type="date"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        value={assignData.deadlineDate}
                        onChange={e => setAssignData({ ...assignData, deadlineDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Other Facilities</label>
                      <textarea
                        className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        value={assignData.otherFacilities}
                        onChange={e => setAssignData({ ...assignData, otherFacilities: e.target.value })}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button type="button" variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                      <Button type="submit">Assign Task</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LayoutDashboard className="h-8 w-8 text-primary" />
                <h1 className="text-2xl md:text-3xl font-display font-bold">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground">
                Manage and resolve civic issues and users across Banaskantha District
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm bg-secondary text-secondary-foreground px-4 py-2 rounded-lg">
              <Users className="h-4 w-4" />
              <span>Admin: {user.name} ({user.email})</span>
            </div>
          </div>

          <Tabs defaultValue="complaints" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
              <TabsTrigger value="complaints">Complaints</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="complaints" className="space-y-6">
              {/* Stats */}
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

              {/* Filters */}
              <Card>
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
                  {isIssuesLoading ? (
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
                            <TableHead className="w-[120px]">ID</TableHead>
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
                          {filteredIssues.map((issue) => (
                            <TableRow key={issue.id}>
                              <TableCell className="font-mono text-xs font-medium">
                                {issue.complaintNumber || 'N/A'}
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
                                <span className="capitalize text-sm">{issue.category}</span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="line-clamp-1 max-w-[150px]">{issue.address}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col text-sm">
                                  <span>{issue.assigneeName || 'Unassigned'}</span>
                                  {issue.assigneeMobile && <span className="text-xs text-muted-foreground">{issue.assigneeMobile}</span>}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {issue.deadlineDate
                                    ? format(new Date(issue.deadlineDate), 'dd MMM')
                                    : '-'}
                                </div>
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
                                <div className="flex items-center justify-end gap-2">
                                  <Button variant="ghost" size="icon" asChild title="View Details">
                                    <Link to={`/issue/${issue.id}`}>
                                      <Eye className="h-4 w-4 text-primary" />
                                    </Link>
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                    onClick={() => openAssignDialog(issue)}
                                    title="Assign Task"
                                  >
                                    Assign
                                  </Button>

                                  {issue.status !== 'resolved' && (
                                    <Button
                                      size="sm"
                                      className="h-8 bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleStatusChange(issue.id, 'resolved')}
                                      title="Mark as Resolved"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-1" />
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
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              {/* User Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Users"
                  value={totalUsers}
                  icon={Users}
                  variant="primary"
                />
                <StatCard
                  title="Citizens"
                  value={citizenCount}
                  icon={UserIcon}
                  variant="secondary"
                />
                <StatCard
                  title="Admins"
                  value={adminCount}
                  icon={Users}
                  variant="accent"
                />
              </div>

              {/* Users Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    All Users ({totalUsers})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isUsersLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading users...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No users found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Joined Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <span className={`capitalize inline-block px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-secondary text-secondary-foreground'
                                  }`}>
                                  {user.role}
                                </span>
                              </TableCell>
                              <TableCell>{user.phone || '-'}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(user.createdAt, 'dd MMM yyyy')}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      {/* Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Issue</DialogTitle>
            <DialogDescription>
              Assign the issue to an official and set a deadline.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assigneeName" className="text-right">
                Assignee
              </Label>
              <Input
                id="assigneeName"
                value={assignData.assigneeName}
                onChange={(e) => setAssignData({ ...assignData, assigneeName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assigneeMobile" className="text-right">
                Mobile
              </Label>
              <Input
                id="assigneeMobile"
                value={assignData.assigneeMobile}
                onChange={(e) => setAssignData({ ...assignData, assigneeMobile: e.target.value })}
                className="col-span-3"
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
                onChange={(e) => setAssignData({ ...assignData, expectedCompletionDays: e.target.value })}
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
                onChange={(e) => setAssignData({ ...assignData, deadlineDate: e.target.value })}
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
                onChange={(e) => setAssignData({ ...assignData, otherFacilities: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignSubmit}>Save Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
