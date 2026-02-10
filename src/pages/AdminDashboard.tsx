import { Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { StatsGrid } from '@/components/admin/StatsGrid';
import { Reveal } from '@/components/ui/Reveal';
import { Shield, CheckCircle2, Server, Database, Activity } from 'lucide-react';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const { issues } = useIssues();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // Issue Stats
  const totalIssues = issues.length;
  const pendingCount = issues.filter(i => i.status === 'pending').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const highSeverityCount = issues.filter(i => i.severity === 'high').length;

  return (
    <AdminLayout>
      <div className="space-y-8 relative">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-50">
          <div className="absolute top-0 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-20 right-40 w-56 h-56 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <Reveal>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <h1 className="text-3xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                  Admin Dashboard
                </h1>
              </div>
              <p className="text-muted-foreground">Welcome back, {user.name}. Here's what's happening today.</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs bg-green-500/10 text-green-600 border border-green-500/20 px-3 py-1.5 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-medium">System Online</span>
              </div>
              <div className="text-sm text-muted-foreground/60 font-mono">
                v1.2.0-stable
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <StatsGrid
            totalIssues={totalIssues}
            pendingCount={pendingCount}
            inProgressCount={inProgressCount}
            resolvedCount={resolvedCount}
            highSeverityCount={highSeverityCount}
          />
        </Reveal>

        <Reveal delay={200}>
          <div className="grid md:grid-cols-3 gap-6">
            {/* System Health Card */}
            <div className="md:col-span-2 bg-gradient-to-br from-card to-card/50 border rounded-2xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="h-24 w-24" />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">System Health Status</h3>
                  <p className="text-sm text-muted-foreground">Real-time performance metrics</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-background/50 border rounded-xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Server className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">API Server</p>
                    <p className="font-bold text-green-600 flex items-center gap-1.5">
                      Operational <CheckCircle2 className="h-3 w-3" />
                    </p>
                  </div>
                </div>

                <div className="bg-background/50 border rounded-xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Database className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Database</p>
                    <p className="font-bold text-blue-600 flex items-center gap-1.5">
                      Connected <CheckCircle2 className="h-3 w-3" />
                    </p>
                  </div>
                </div>

                <div className="bg-background/50 border rounded-xl p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase">Security</p>
                    <p className="font-bold text-orange-600 flex items-center gap-1.5">
                      Active <CheckCircle2 className="h-3 w-3" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats or Info */}
            <div className="bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

              <h3 className="font-display font-bold text-lg mb-2">Platform Growth</h3>
              <p className="text-muted-foreground text-sm mb-6">
                User engagement has increased by <span className="text-primary font-bold">12%</span> this week.
              </p>

              <div className="mt-auto">
                <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full" />
                </div>
                <div className="flex justify-between text-xs mt-2 text-muted-foreground">
                  <span>Weekly Goal</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </AdminLayout>
  );
}
