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
import { Logo } from '@/components/ui/Logo';

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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-background">
        {/* Background Elements */}
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-black/[0.04] dark:bg-grid-white/[0.04] -z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background -z-10" />
        <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] bg-blue-500/30 rounded-full blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-[30rem] h-[30rem] bg-green-500/30 rounded-full blur-[100px] opacity-60 animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 backdrop-blur-sm shadow-sm animate-fade-in hover:bg-blue-500/20 transition-colors cursor-default">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="font-semibold text-sm tracking-wide">Government of Gujarat Initiative</span>
            </div>

            {/* Headline with Logo */}
            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight leading-[1.1] animate-fade-in [animation-delay:200ms] opacity-0 fill-mode-forwards select-none text-center">
              <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                NagrikSetu
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl text-muted-foreground font-bold mt-2 tracking-normal">
                Banaskantha District
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed animate-fade-in [animation-delay:400ms] opacity-0 fill-mode-forwards">
              Empowering citizens with a seamless platform to report issues, track resolutions, and build a better community together.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:600ms] opacity-0 fill-mode-forwards pt-4">
              {user ? (
                <>
                  <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-none" asChild>
                    <Link to="/report">
                      <FileText className="h-5 w-5 mr-2" />
                      Report Issue
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-secondary/5 transition-all hover:scale-105" asChild>
                    <Link to="/dashboard">
                      Dashboard
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all hover:scale-105 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-none" asChild>
                    <Link to="/register">
                      Get Started
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-secondary/5 transition-all hover:scale-105" asChild>
                    <Link to="/login">
                      Login
                    </Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border/50 animate-fade-in [animation-delay:800ms] opacity-0 fill-mode-forwards">
              {[
                { label: "Active Citizens", value: "50K+" },
                { label: "Issues Resolved", value: "12K+" },
                { label: "Response Time", value: "< 24h" },
                { label: "Satisfaction", value: "98%" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
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
                <Card className="group relative overflow-hidden border-border/50 bg-background/50 hover:bg-background hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <CardContent className="pt-8 pb-8 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                      <feature.icon className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                    </div>

                    <h3 className="font-display font-bold text-xl mb-3 text-foreground group-hover:text-orange-600 transition-colors duration-300">
                      {feature.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
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
          <Reveal>
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
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentIssues.map((issue, index) => (
              <Reveal key={issue.id} delay={index * 100}>
                <IssueCard issue={issue} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 -z-20" />
        <div className="absolute inset-0 bg-grid-black/[0.04] -z-10" />

        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-orange-200/40 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-200/40 rounded-full blur-[100px] animate-pulse delay-700" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <Reveal threshold={0.5}>
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Icon Container */}
              <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white shadow-xl shadow-orange-500/10 mb-4 group hover:scale-110 transition-transform duration-500 border border-orange-100">
                <Users className="h-10 w-10 text-orange-600 group-hover:text-orange-500 transition-colors" />
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground tracking-tight leading-tight">
                Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Movement</span>
              </h2>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Be a part of the digital transformation in Banaskantha. Your participation
                helps us identify and resolve issues faster, making our district a better place to live.
              </p>

              {!user && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button size="lg" asChild className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 border-none transition-all hover:scale-105 hover:shadow-orange-500/40">
                    <Link to="/register">
                      <Zap className="h-5 w-5 mr-2" />
                      Register Now
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="h-14 px-8 text-lg rounded-full border-2 border-input bg-background hover:bg-muted text-foreground transition-all hover:scale-105">
                    <Link to="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                How It <span className="text-primary">Works</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Reporting and tracking issues has never been easier.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-[2rem] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent -z-10" />
            {[
              { step: 1, icon: Users, title: 'Register', desc: 'Create your free account in seconds' },
              { step: 2, icon: FileText, title: 'Report', desc: 'Submit issue with photo & location' },
              { step: 3, icon: Clock, title: 'Track', desc: 'Monitor progress in real-time' },
              { step: 4, icon: CheckCircle2, title: 'Resolved', desc: 'Get notified when issue is fixed' },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 150} className="relative bg-background p-4 rounded-xl">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 transform transition-transform duration-300 hover:scale-110 hover:rotate-3 shadow-sm">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto -mt-10 mb-6 text-sm font-bold relative z-10 ring-4 ring-background">
                  {item.step}
                </div>
                <div className="text-center">
                  <h3 className="font-display font-semibold mb-2 text-xl">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
