import { Layout } from '@/components/layout/Layout';
import { CitizenIssuesTable } from '@/components/citizen/CitizenIssuesTable';
import { useIssues } from '@/context/IssueContext';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AllIssues() {
   const { issues, isLoading } = useIssues();
   const { user } = useAuth();

   // decide if we want to protect this page
   // For now, let's allow it but maybe optional login?
   // The IssueContext usually requires auth to fetch issues?
   // Checking App.tsx, IssueProvider wraps everything.
   // Checking Home.tsx, it uses useIssues() and shows recent issues WITHOUT login check (layout shows auth buttons).
   // So it seems public access is allowed for reading issues.

   return (
      <Layout>
         <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
               <h1 className="text-3xl font-display font-bold mb-2">Community Reports</h1>
               <p className="text-muted-foreground">
                  Browse all civic issues reported in Banaskantha.
               </p>
            </div>
            <CitizenIssuesTable issues={issues} isLoading={isLoading} />
         </div>
      </Layout>
   );
}
