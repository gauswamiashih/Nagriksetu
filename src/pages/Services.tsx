import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const services = [
  {
    icon: '🛣️',
    title: 'Road & Potholes',
    description: 'Report damaged roads, potholes, broken footpaths, and road safety issues.',
    issues: ['Potholes', 'Road cracks', 'Damaged footpaths', 'Missing road signs', 'Speed breaker issues'],
    color: 'bg-orange-50 border-orange-200',
  },
  {
    icon: '💧',
    title: 'Water Supply',
    description: 'Report water supply disruptions, contamination, leakage, and pipeline issues.',
    issues: ['No water supply', 'Low pressure', 'Water contamination', 'Pipeline leakage', 'Irregular supply'],
    color: 'bg-blue-50 border-blue-200',
  },
  {
    icon: '⚡',
    title: 'Electricity',
    description: 'Report power outages, electrical hazards, transformer issues, and billing problems.',
    issues: ['Power outage', 'Exposed wires', 'Transformer issues', 'Frequent fluctuations', 'Meter problems'],
    color: 'bg-yellow-50 border-yellow-200',
  },
  {
    icon: '🗑️',
    title: 'Garbage & Sanitation',
    description: 'Report garbage accumulation, missed collections, and sanitation concerns.',
    issues: ['Garbage pile-up', 'Missed collection', 'Open dumping', 'Unclean public areas', 'Stray animals'],
    color: 'bg-green-50 border-green-200',
  },
  {
    icon: '💡',
    title: 'Street Lights',
    description: 'Report non-functional street lights, broken poles, and dark areas.',
    issues: ['Non-working lights', 'Broken poles', 'Dim lighting', 'Dark areas', 'Timer issues'],
    color: 'bg-amber-50 border-amber-200',
  },
  {
    icon: '🚰',
    title: 'Drainage',
    description: 'Report blocked drains, sewage overflow, and waterlogging issues.',
    issues: ['Blocked drains', 'Sewage overflow', 'Waterlogging', 'Open manholes', 'Bad odor'],
    color: 'bg-cyan-50 border-cyan-200',
  },
];

export default function Services() {
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-secondary-foreground">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              Report various civic issues directly to the Banaskantha district administration
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card 
                key={service.title} 
                className={`hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 ${service.color}`}
              >
                <CardHeader>
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <h4 className="text-sm font-medium mb-3">Common Issues:</h4>
                  <ul className="space-y-2">
                    {service.issues.map((issue) => (
                      <li key={issue} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-secondary text-secondary-foreground">
              <CardContent className="pt-8 pb-8">
                <h2 className="text-2xl font-display font-bold mb-4">
                  Ready to Report an Issue?
                </h2>
                <p className="text-secondary-foreground/80 mb-6">
                  Your voice matters! Help us improve Banaskantha by reporting civic issues in your area.
                </p>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link to={user ? '/report' : '/register'}>
                    {user ? 'Report an Issue' : 'Get Started'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              How to <span className="text-primary">Report</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to report a civic issue
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Select Category', desc: 'Choose the type of issue you want to report' },
              { step: 2, title: 'Describe Issue', desc: 'Provide detailed description of the problem' },
              { step: 3, title: 'Add Location', desc: 'Pin the exact location on the map' },
              { step: 4, title: 'Submit & Track', desc: 'Submit and track the resolution progress' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-xl font-bold">
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
