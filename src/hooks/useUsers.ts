import { useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

export function useUsers() {
   const [users, setUsers] = useState<User[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      const fetchUsers = async () => {
         try {
            const { data, error } = await supabase.from('users').select('*');
            if (error) throw error;

            // Map Supabase user to App user if needed, or cast
            // The DB 'users' table structure matches our needs mostly
            const mappedUsers: User[] = data.map(u => ({
               id: u.id,
               email: u.email,
               name: u.full_name,
               role: u.role as 'citizen' | 'admin',
               createdAt: new Date(u.created_at)
            }));

            setUsers(mappedUsers);
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
