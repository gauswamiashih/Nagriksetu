import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Bell, Lock, User, Shield, Info } from 'lucide-react';

export default function AdminSettings() {
   const { user, isAdmin } = useAuth();
   const [emailNotifications, setEmailNotifications] = useState(true);
   const [systemMaintenance, setSystemMaintenance] = useState(false);

   if (!user) {
      return <Navigate to="/login" replace />;
   }

   if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
   }

   const handleSave = () => {
      toast.success("Settings saved successfully");
   };

   return (
      <AdminLayout>
         <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
            <div>
               <h1 className="text-3xl font-display font-bold">Settings</h1>
               <p className="text-muted-foreground">Manage application preferences and system configuration</p>
            </div>

            <div className="grid gap-6">
               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <CardTitle>Notifications</CardTitle>
                     </div>
                     <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <Label>Email Notifications</Label>
                           <p className="text-sm text-muted-foreground">Receive daily summaries of reported issues.</p>
                        </div>
                        <Switch
                           checked={emailNotifications}
                           onCheckedChange={setEmailNotifications}
                        />
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle>System</CardTitle>
                     </div>
                     <CardDescription>Manage global system settings.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                           <Label>Maintenance Mode</Label>
                           <p className="text-sm text-muted-foreground">Prevent users from accessing the platform.</p>
                        </div>
                        <Switch
                           checked={systemMaintenance}
                           onCheckedChange={setSystemMaintenance}
                        />
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <CardTitle>Profile Check</CardTitle>
                     </div>
                     <CardDescription>Your current admin session details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex justify-between">
                           <span className="text-sm font-medium">Name:</span>
                           <span className="text-sm">{user.name}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm font-medium">Email:</span>
                           <span className="text-sm">{user.email}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-sm font-medium">Role:</span>
                           <span className="text-sm capitalize">{user.role}</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Changes</Button>
               </div>
            </div>
         </div>
      </AdminLayout>
   );
}
