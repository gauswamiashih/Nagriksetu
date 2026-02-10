import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, CheckCircle2, Signpost, Droplets, Zap, Trash2, Lightbulb, Waves, Construction, ShieldAlert } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const services = [
  {
    icon: Signpost,
    title: 'Road & Potholes',
    description: 'Report damaged roads, potholes, broken footpaths, and road safety issues.',
    issues: ['Potholes', 'Road cracks', 'Damaged footpaths', 'Missing road signs', 'Speed breaker issues'],
    color: 'bg-orange-50 border-orange-200 text-orange-600',
    iconBg: 'bg-orange-100',
  },
  {
    icon: Droplets,
    title: 'Water Supply',
    description: 'Report water supply disruptions, contamination, leakage, and pipeline issues.',
    issues: ['No water supply', 'Low pressure', 'Water contamination', 'Pipeline leakage', 'Irregular supply'],
    color: 'bg-blue-50 border-blue-200 text-blue-600',
    iconBg: 'bg-blue-100',
  },
  {
    icon: Zap,
    title: 'Electricity',
    description: 'Report power outages, electrical hazards, transformer issues, and billing problems.',
    issues: ['Power outage', 'Exposed wires', 'Transformer issues', 'Frequent fluctuations', 'Meter problems'],
    color: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
  {
    icon: Trash2,
    title: 'Garbage & Sanitation',
    description: 'Report garbage accumulation, missed collections, and sanitation concerns.',
    issues: ['Garbage pile-up', 'Missed collection', 'Open dumping', 'Unclean public areas', 'Stray animals'],
    color: 'bg-green-50 border-green-200 text-green-600',
    iconBg: 'bg-green-100',
  },
  {
    icon: Lightbulb,
    title: 'Street Lights',
    description: 'Report non-functional street lights, broken poles, and dark areas.',
    issues: ['Non-working lights', 'Broken poles', 'Dim lighting', 'Dark areas', 'Timer issues'],
    color: 'bg-amber-50 border-amber-200 text-amber-600',
    iconBg: 'bg-amber-100',
  },
  {
    icon: Waves,
    title: 'Drainage',
    description: 'Report blocked drains, sewage overflow, and waterlogging issues.',
    issues: ['Blocked drains', 'Sewage overflow', 'Waterlogging', 'Open manholes', 'Bad odor'],
    color: 'bg-cyan-50 border-cyan-200 text-cyan-600',
    iconBg: 'bg-cyan-100',
  },
];

export default function Services() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 backdrop-blur-sm shadow-sm mb-6">
                <Construction className="h-4 w-4" />
                <span className="text-sm font-medium">Public Works</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight">
                Our <span className="text-gradient">Services</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Comprehensive civic solutions for a better Banaskantha. Report, track, and resolve issues with ease.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={index * 50}>
                <Card className={`h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border ${service.color.split(' ')[1]} bg-white dark:bg-card group overflow-hidden`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${service.iconBg} rounded-bl-[100px] opacity-20 transition-transform duration-500 group-hover:scale-150`} />

                  <CardHeader className="relative">
                    <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-4 shadow-inner group-hover:rotate-6 transition-transform duration-300`}>
                      <service.icon className={`h-8 w-8 ${service.color.split(' ').pop()}`} />
                    </div>
                    <CardTitle className="text-2xl font-bold">{service.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <ShieldAlert className="h-4 w-4" /> Common Issues
                    </h4>
                    <ul className="space-y-3">
                      {service.issues.map((issue) => (
                        <li key={issue} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className={`h-5 w-5 ${service.color.split(' ').pop()} shrink-0`} />
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-24 text-center">
            <Reveal threshold={0.5}>
              <Card className="max-w-4xl mx-auto bg-gradient-to-r from-secondary to-secondary/90 text-secondary-foreground shadow-2xl relative overflow-hidden border-none">
                <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.1]" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-50" />

                <CardContent className="pt-12 pb-12 px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left">
                    <h2 className="text-3xl font-display font-bold mb-2 text-white">
                      Ready to Report an Issue?
                    </h2>
                    <p className="text-white/80 text-lg max-w-lg">
                      Your voice matters! Help us improve Banaskantha by reporting civic issues in your area today.
                    </p>
                  </div>
                  <Button size="lg" asChild className="bg-white text-secondary hover:bg-white/90 font-bold px-8 py-6 rounded-full shadow-lg hover:shadow-white/20 transition-all duration-300 transform hover:scale-105">
                    <Link to={user ? '/report' : '/register'}>
                      {user ? 'Report Now' : 'Get Started'}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-32 bg-muted/40 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                How to <span className="text-primary">Report</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to make a difference in your community
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -z-10" />

            {[
              { step: 1, title: 'Select Category', desc: 'Choose the type of issue you want to report' },
              { step: 2, title: 'Describe Issue', desc: 'Provide detailed description of the problem' },
              { step: 3, title: 'Add Location', desc: 'Pin the exact location on the map' },
              { step: 4, title: 'Submit & Track', desc: 'Submit and track the resolution progress' },
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 150} className="relative bg-background/50 md:bg-transparent p-6 md:p-0 rounded-xl border md:border-none border-border/50">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-orange-500 text-white flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg shadow-primary/20 ring-4 ring-background relative z-10 transition-transform duration-300 hover:scale-110">
                    {item.step}
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
