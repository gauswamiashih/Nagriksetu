import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Building2,
  Globe,
  Loader2
} from 'lucide-react';
import { z } from 'zod';
import { Reveal } from '@/components/ui/Reveal';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit mobile').optional().or(z.literal('')),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
});

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      contactSchema.parse(formData);
      setErrors({});
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm shadow-sm mb-6">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">Get in Touch</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight">
                Contact <span className="text-gradient">Us</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Have questions or suggestions? We're here to help you build a better Banaskantha.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <Reveal delay={100}>
                <div>
                  <h2 className="text-3xl font-display font-bold mb-6">Contact Information</h2>
                  <p className="text-muted-foreground mb-8">
                    Reach out to us through any of these channels. We value your feedback and engagement.
                  </p>
                </div>
              </Reveal>

              {[
                { icon: Building2, title: 'Office Address', content: <><span className="font-semibold block text-foreground">District Collector Office</span> Palanpur, Banaskantha<br />Gujarat - 385001</>, color: 'text-primary', bg: 'bg-primary/10' },
                { icon: Phone, title: 'Phone', content: <><a href="tel:+919664592743" className="hover:text-primary transition-colors">+91 96645 92743</a><br /><a href="tel:+912742252526" className="hover:text-primary transition-colors">+91 2742 252526</a></>, color: 'text-green-600', bg: 'bg-green-100' },
                { icon: Mail, title: 'Email', content: <><a href="mailto:gauswamiashish760@gmail.com" className="hover:text-primary transition-colors">gauswamiashish760@gmail.com</a><br /><a href="mailto:support@nagriksetu.gov.in" className="hover:text-primary transition-colors">support@nagriksetu.gov.in</a></>, color: 'text-orange-600', bg: 'bg-orange-100' },
                { icon: Clock, title: 'Working Hours', content: <>Monday - Saturday<br />10:00 AM - 6:00 PM<br /><span className="text-xs text-muted-foreground">(Closed on Sundays & Public Holidays)</span></>, color: 'text-purple-600', bg: 'bg-purple-100' },
                { icon: Globe, title: 'Official Website', content: <a href="https://banaskantha.gujarat.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">banaskantha.gujarat.gov.in</a>, color: 'text-blue-600', bg: 'bg-blue-100' },
              ].map((item, index) => (
                <Reveal key={item.title} delay={index * 100 + 200}>
                  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <div className="text-sm text-muted-foreground leading-relaxed">
                          {item.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Reveal delay={300} className="h-full">
                <Card className="h-full border-none shadow-2xl bg-white/50 dark:bg-card/50 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full -z-10" />
                  <CardHeader className="md:p-10 pb-0">
                    <CardTitle className="text-3xl font-display">Send us a Message</CardTitle>
                    <CardDescription className="text-lg">
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="md:p-10 pt-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-base">Full Name <span className="text-red-500">*</span></Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-12 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 transition-colors"
                          />
                          {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-base">Email Address <span className="text-red-500">*</span></Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-12 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 transition-colors"
                          />
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-base">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-12 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 transition-colors"
                          />
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject" className="text-base">Subject <span className="text-red-500">*</span></Label>
                          <Input
                            id="subject"
                            name="subject"
                            placeholder="What is this about?"
                            value={formData.subject}
                            onChange={handleChange}
                            disabled={isLoading}
                            className="h-12 bg-white/50 dark:bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 transition-colors"
                          />
                          {errors.subject && (
                            <p className="text-sm text-destructive">{errors.subject}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-base">Message <span className="text-red-500">*</span></Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Write your message here..."
                          value={formData.message}
                          onChange={handleChange}
                          disabled={isLoading}
                          rows={6}
                          className="bg-white/50 dark:bg-background/50 backdrop-blur-sm border-muted-foreground/20 focus:border-primary/50 transition-colors resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">
                          {formData.message.length}/1000 characters
                        </p>
                        {errors.message && (
                          <p className="text-sm text-destructive">{errors.message}</p>
                        )}
                      </div>

                      <Button type="submit" size="lg" className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all duration-300" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-3" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-muted/40 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Find <span className="text-primary">Us</span></h2>
                <p className="text-xl text-muted-foreground">Visit our office for in-person assistance</p>
              </div>
            </Reveal>
            <Reveal threshold={0.2} delay={200}>
              <Card className="overflow-hidden border-none shadow-2xl rounded-3xl">
                <div className="h-96 bg-muted relative group">
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <div className="text-center p-8 bg-background/80 backdrop-blur-md rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:scale-105">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-bounce">
                        <MapPin className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">District Collector Office</h3>
                      <p className="text-muted-foreground mb-1">
                        Palanpur, Banaskantha - 385001
                      </p>
                      <p className="text-muted-foreground">
                        Gujarat, India
                      </p>
                      <Button variant="outline" className="mt-6 hover:bg-primary hover:text-white transition-colors">
                        Get Directions
                      </Button>
                    </div>
                  </div>
                  {/* Placeholder for actual map integration */}
                  <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20" />
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>
    </Layout>
  );
}
