import { useState, useEffect } from 'react';
import { User } from '@/types';

export function useUsers() {
   const [users, setUsers] = useState<User[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            const storedUsers = localStorage.getItem('nagriksetu_users');
            if (storedUsers) {
               const parsedUsers = JSON.parse(storedUsers);
               // Convert date strings back to Date objects
               const formattedUsers = parsedUsers.map((u: any) => ({
                  ...u,
                  createdAt: new Date(u.createdAt)
               }));
               setUsers(formattedUsers);
            }
         } catch (error) {
            console.error('Failed to fetch users:', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchUsers();
   }, []);

   return { users, isLoading };
}
