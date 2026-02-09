import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'gauswamiashish760@gmail.com';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        if (session?.user) {
          const user = await mapSupabaseUserToUser(session.user);
          setUser(user);
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const mappedUser = await mapSupabaseUserToUser(session.user);
          setUser(mappedUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error on auth change:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      toast.success('Welcome back!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'citizen', // Default role
          },
        },
      });

      if (error) throw error;

      // Create user record in 'users' table if not triggered by DB
      if (data.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: name,
              role: 'citizen',
            },
          ])
          .select();

        if (dbError) console.error('Error creating user profile:', dbError);
      }

      toast.success('Account created! Please check your email for verification if enabled, or login.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset link');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, resetPassword, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper to map Supabase auth user to our app User type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapSupabaseUserToUser(authUser: any): Promise<User> {
  try {
    // Fetch additional profile data from 'users' table if needed, 
    // or trust metadata. For now, we trust metadata for speed.
    // Wrap in a timeout to prevent hanging if DB is unreachable
    const profilePromise = supabase
      .from('users')
      .select('*')
      .eq('id', authUser.id)
      .single();

    // Race with a timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let profile: any = { data: null };
    try {
      profile = await Promise.race([profilePromise, timeoutPromise]);
    } catch (e) {
      console.warn('Profile fetch timed out or failed, using metadata:', e);
    }

    const name = profile.data?.full_name || authUser.user_metadata?.full_name || 'User';
    const role = profile.data?.role || authUser.user_metadata?.role || 'citizen';

    return {
      id: authUser.id,
      email: authUser.email,
      name: name,
      role: role as 'citizen' | 'admin',
      createdAt: new Date(authUser.created_at),
    };
  } catch (error) {
    console.error('Error mapping user:', error);
    // Fallback to basic auth user data
    return {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name || 'User',
      role: (authUser.user_metadata?.role || 'citizen') as 'citizen' | 'admin',
      createdAt: new Date(authUser.created_at),
    };
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
