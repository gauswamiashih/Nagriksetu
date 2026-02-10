import { format } from "date-fns";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import {
   MoreHorizontal,
   Shield,
   User as UserIcon,
   CheckCircle2,
   Calendar,
   Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";

interface UsersTableProps {
   users: User[];
   isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
   if (isLoading) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            Loading users...
         </div>
      );
   }

   if (users.length === 0) {
      return (
         <div className="text-center py-8 text-muted-foreground">
            No users found.
         </div>
      );
   }

   return (
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden animate-fade-in-up">
         <Table>
            <TableHeader className="bg-muted/50">
               <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/5 transition-colors group">
                     <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                        <span title={user.id}>{user.id.substring(0, 8)}...</span>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-col">
                           <span className="font-medium text-foreground">{user.name}</span>
                           <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${user.role === 'admin'
                           ? 'bg-purple-500/10 text-purple-600 border-purple-200/50'
                           : 'bg-blue-500/10 text-blue-600 border-blue-200/50'
                           }`}>
                           {user.role === 'admin' ? <Shield className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                           <span className="capitalize">{user.role}</span>
                        </div>
                     </TableCell>
                     <TableCell>
                        <span className="text-sm text-muted-foreground">Banaskantha</span>
                     </TableCell>
                     <TableCell>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-200/50">
                           <CheckCircle2 className="h-3 w-3" />
                           Active
                        </div>
                     </TableCell>
                     <TableCell>
                        {user.phone ? (
                           <div className="flex items-center gap-2 text-sm text-foreground/80">
                              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{user.phone}</span>
                           </div>
                        ) : (
                           <span className="text-muted-foreground text-sm italic py-1 px-2">-</span>
                        )}
                     </TableCell>
                     <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <Calendar className="h-3.5 w-3.5" />
                           {format(new Date(user.createdAt), "dd MMM yyyy")}
                        </div>
                     </TableCell>
                     <TableCell className="text-right">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                 <span className="sr-only">Open menu</span>
                                 <MoreHorizontal className="h-4 w-4" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                 onClick={() => navigator.clipboard.writeText(user.id)}
                              >
                                 Copy ID
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive">Delete User</DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}
