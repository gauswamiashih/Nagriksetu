import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Shield, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
   email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
   const { resetPassword, isLoading } = useAuth();

   const [email, setEmail] = useState('');
   const [error, setError] = useState('');
   const [isSubmitted, setIsSubmitted] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      try {
         forgotPasswordSchema.parse({ email });
         setError('');

         await resetPassword(email);
         setIsSubmitted(true);
      } catch (err) {
         if (err instanceof z.ZodError) {
            setError(err.errors[0]?.message || 'Invalid email');
         } else {
            setError('An error occurred. Please try again.');
         }
      }
   };

   if (isSubmitted) {
      return (
         <Layout showFooter={false}>
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/30">
               <Card className="w-full max-w-md shadow-lg">
                  <CardHeader className="text-center">
                     <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                     </div>
                     <CardTitle>Check your email</CardTitle>
                     <CardDescription>
                        If an account exists for {email}, we have sent a password reset link.
                     </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-center">
                     <Button asChild variant="outline" className="w-full">
                        <Link to="/login">
                           <ArrowLeft className="mr-2 h-4 w-4" />
                           Back to Login
                        </Link>
                     </Button>
                  </CardFooter>
               </Card>
            </div>
         </Layout>
      );
   }

   return (
      <Layout showFooter={false}>
         <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-muted/30">
            <div className="w-full max-w-md">
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                     <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-display font-bold">NagrikSetu</h1>
                  <p className="text-muted-foreground">Citizen Services Platform</p>
               </div>

               <Card className="shadow-lg glass-card">
                  <form onSubmit={handleSubmit}>
                     <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                           Enter your email address and we'll send you a link to reset your password.
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="email">Email Address</Label>
                           <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="you@example.com"
                                 value={email}
                                 onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                 }}
                                 className="pl-10"
                                 disabled={isLoading}
                              />
                           </div>
                           {error && (
                              <p className="text-sm text-destructive">{error}</p>
                           )}
                        </div>
                     </CardContent>
                     <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                           {isLoading ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Sending Link...
                              </>
                           ) : (
                              'Send Reset Link'
                           )}
                        </Button>
                        <Button asChild variant="ghost" className="w-full">
                           <Link to="/login">
                              <ArrowLeft className="mr-2 h-4 w-4" />
                              Back to Login
                           </Link>
                        </Button>
                     </CardFooter>
                  </form>
               </Card>
            </div>
         </div>
      </Layout>
   );
}
