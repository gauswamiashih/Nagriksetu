import { Link, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { IssueCard } from '@/components/ui/IssueCard';
import { StatCard } from '@/components/ui/StatCard';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { CitizenIssuesTable } from '@/components/citizen/CitizenIssuesTable';

export default function CitizenDashboard() {
  const { user, isAdmin } = useAuth();
  const { userIssues, isLoading } = useIssues();

  // Redirect admin to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const pendingCount = userIssues.filter(i => i.status === 'pending').length;
  const inProgressCount = userIssues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = userIssues.filter(i => i.status === 'resolved').length;
  const totalCount = userIssues.length;

  return (
    <Layout>
      <div className="bg-muted/30 min-h-[calc(100vh-64px)]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                Welcome, {user.name}! 👋
              </h1>
              <p className="text-muted-foreground">
                Track and manage your reported issues from here.
              </p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/report">
                <Plus className="h-5 w-5 mr-2" />
                Report New Issue
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Reports"
              value={totalCount}
              icon={FileText}
              variant="primary"
            />
            <StatCard
              title="Pending"
              value={pendingCount}
              icon={AlertCircle}
              variant="default"
            />
            <StatCard
              title="In Progress"
              value={inProgressCount}
              icon={Clock}
              variant="default"
            />
            <StatCard
              title="Resolved"
              value={resolvedCount}
              icon={CheckCircle2}
              variant="accent"
            />
          </div>

          {/* User Info Card */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since {format(user.createdAt, 'MMMM yyyy')}
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">District</span>
                    <span className="font-medium">Banaskantha</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/report"
                    className="p-4 rounded-lg border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Plus className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <span className="font-medium">Report Issue</span>
                    <span className="text-xs text-muted-foreground">Submit a new complaint</span>
                  </Link>
                  <Link
                    to="/issues"
                    className="p-4 rounded-lg border hover:border-secondary hover:bg-secondary/5 transition-all flex flex-col items-center justify-center text-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-2 group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                      <FileText className="h-6 w-6 text-secondary group-hover:text-secondary-foreground" />
                    </div>
                    <span className="font-medium">View All Issues</span>
                    <span className="text-xs text-muted-foreground">Browse community reports</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Your Recent Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CitizenIssuesTable issues={userIssues} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout >
  );
}
