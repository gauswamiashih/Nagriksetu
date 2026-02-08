import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useIssues } from '@/context/IssueContext';
import { IssueCard } from '@/components/ui/IssueCard';
import {
  Shield,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Users,
  FileText,
  BarChart3,
  Smartphone,
  Zap,
  HeartHandshake,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const features = [
  {
    icon: FileText,
    title: 'Easy Reporting',
    description: 'Report civic issues in just a few clicks with photo and location support.',
  },
  {
    icon: MapPin,
    title: 'GPS Location',
    description: 'Automatic geo-tagging ensures precise location of reported issues.',
  },
  {
    icon: Clock,
    title: 'Real-time Tracking',
    description: 'Track the status of your complaints from submission to resolution.',
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Priority',
    description: 'Smart severity classification ensures urgent issues get immediate attention.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access the platform from any device, anywhere in Banaskantha district.',
  },
  {
    icon: HeartHandshake,
    title: 'Citizen Connect',
    description: 'Bridge the gap between citizens and local administration effectively.',
  },
];

const stats = [
  { value: '10,000+', label: 'Issues Resolved' },
  { value: '50,000+', label: 'Active Citizens' },
  { value: '24hrs', label: 'Avg Response Time' },
  { value: '95%', label: 'Satisfaction Rate' },
];

const categories = [
  { icon: '🛣️', name: 'Roads & Potholes', count: 234 },
  { icon: '💧', name: 'Water Supply', count: 189 },
  { icon: '⚡', name: 'Electricity', count: 156 },
  { icon: '🗑️', name: 'Garbage', count: 145 },
  { icon: '💡', name: 'Street Lights', count: 98 },
  { icon: '🚰', name: 'Drainage', count: 87 },
];

export default function Home() {
  const { user } = useAuth();
  const { issues } = useIssues();

  const recentIssues = issues.slice(0, 3);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground rounded-full px-4 py-1.5 text-sm mb-6 animate-fade-in">
              <Shield className="h-4 w-4" />
              <span>Government of Gujarat Initiative</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-secondary-foreground mb-6 leading-tight animate-fade-in [animation-delay:200ms] opacity-0 fill-mode-forwards">
              NagrikSetu
              <span className="block text-primary">Banaskantha</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 mb-8 max-w-2xl animate-fade-in [animation-delay:400ms] opacity-0 fill-mode-forwards">
              Your voice matters. Report civic issues directly to the district administration
              and track their resolution in real-time. Together, let's build a better Banaskantha.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in [animation-delay:600ms] opacity-0 fill-mode-forwards">
              {user ? (
                <>
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                    <Link to="/report">
                      <FileText className="h-5 w-5 mr-2" />
                      Report an Issue
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20">
                    <Link to="/dashboard">
                      View My Dashboard
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="bg-secondary-foreground/10 border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/20">
                    <Link to="/login">
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 -mt-6 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} delay={index * 100}>
                <Card className="text-center glass-card hover:scale-105 transition-transform duration-300">
                  <CardContent className="pt-6">
                    <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose <span className="text-primary">NagrikSetu</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A modern platform designed to make civic engagement simple, transparent, and effective.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 100}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-primary/30 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 group-hover:scale-110 transform">
                      <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Report By <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select from various issue categories to ensure your complaint reaches the right department.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Reveal key={category.name} delay={index * 50}>
                <Link
                  to={user ? '/report' : '/login'}
                  className="group"
                >
                  <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-primary/30 group-hover:bg-primary/5">
                    <CardContent className="py-6">
                      <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                      <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">{category.count} issues</p>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Recent <span className="text-primary">Reports</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                See what issues are being reported and resolved in your community.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/issues">
                View All Issues
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Users className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Join the Movement
            </h2>
            <p className="text-lg text-secondary-foreground/80 mb-8">
              Be a part of the digital transformation in Banaskantha. Your participation
              helps us identify and resolve issues faster, making our district a better place to live.
            </p>
            {!user && (
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/register">
                    <Zap className="h-5 w-5 mr-2" />
                    Register Now
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How It <span className="text-primary">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Reporting and tracking issues has never been easier.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, icon: Users, title: 'Register', desc: 'Create your free account in seconds' },
              { step: 2, icon: FileText, title: 'Report', desc: 'Submit issue with photo & location' },
              { step: 3, icon: Clock, title: 'Track', desc: 'Monitor progress in real-time' },
              { step: 4, icon: CheckCircle2, title: 'Resolved', desc: 'Get notified when issue is fixed' },
            ].map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20 hidden md:block" style={{ display: index === 3 ? 'none' : undefined }} />
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto -mt-2 mb-4 text-sm font-bold relative z-10">
                  {item.step}
                </div>
                <h3 className="font-display font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
