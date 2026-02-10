import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
   LayoutDashboard,
   Users,
   FileText,
   Settings,
   Menu,
   X,
   Shield,
   LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
   children: React.ReactNode;
}

const sidebarItems = [
   { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
   { icon: Users, label: "Users", href: "/admin/users" }, // Assuming we might have this route later or hash
   { icon: FileText, label: "Reports", href: "/admin/reports" },
   { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function AdminLayout({ children }: AdminLayoutProps) {
   const [isMobileOpen, setIsMobileOpen] = useState(false);
   const location = useLocation();
   const { user, logout } = useAuth();

   const SidebarContent = () => (
      <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
         <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="h-5 w-5" />
               </div>
               <div className="flex flex-col">
                  <span className="font-display font-bold text-lg leading-none">NagrikSetu</span>
                  <span className="text-[10px] text-muted-foreground">Admin Portal</span>
               </div>
            </Link>
            <div className="space-y-1">
               {sidebarItems.map((item) => (
                  <Link
                     key={item.href}
                     to={item.href}
                     onClick={() => setIsMobileOpen(false)}
                  >
                     <Button
                        variant="ghost"
                        className={cn(
                           "w-full justify-start gap-3 mb-1 font-medium",
                           location.pathname === item.href
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                     >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                     </Button>
                  </Link>
               ))}
            </div>
         </div>
         <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-2 mb-4">
               <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground">
                  <Users className="h-4 w-4" />
               </div>
               <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
               </div>
            </div>
            <Button
               variant="outline"
               className="w-full justify-start gap-2 border-sidebar-border text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
               onClick={logout}
            >
               <LogOut className="h-4 w-4" />
               Logout
            </Button>
         </div>
      </div>
   );

   return (
      <div className="flex min-h-screen bg-background">
         {/* Desktop Sidebar */}
         <aside className="hidden lg:block w-64 fixed inset-y-0 z-50">
            <SidebarContent />
         </aside>

         {/* Mobile Sidebar */}
         <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetContent side="left" className="p-0 w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
               <SidebarContent />
            </SheetContent>
         </Sheet>

         {/* Main Content */}
         <main className="flex-1 lg:ml-64 min-h-screen transition-all duration-300 ease-in-out">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
               <div className="lg:hidden mb-6 flex items-center justify-between">
                  <Link to="/" className="flex items-center gap-2">
                     <span className="font-display font-bold text-lg">NagrikSetu Admin</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)}>
                     <Menu className="h-6 w-6" />
                  </Button>
               </div>
               {children}
            </div>
         </main>
      </div>
   );
}
