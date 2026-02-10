import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield,
  Target,
  Eye,
  Users,
  CheckCircle2,
  MapPin,
  Building2,
  Award,
} from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';

const values = [
  {
    icon: Users,
    title: 'Citizen First',
    description: 'Every decision we make puts the citizens of Banaskantha at the forefront.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Real-time tracking ensures complete transparency in issue resolution.',
  },
  {
    icon: Target,
    title: 'Efficiency',
    description: 'AI-powered prioritization helps address critical issues faster.',
  },
  {
    icon: Award,
    title: 'Accountability',
    description: 'Clear ownership and tracking of every reported issue.',
  },
];

const milestones = [
  { year: '2023', title: 'Platform Launch', description: 'NagrikSetu launched for Banaskantha district' },
  { year: '2023', title: '10,000 Users', description: 'Reached 10,000 registered citizens' },
  { year: '2024', title: '5,000 Issues Resolved', description: 'Successfully resolved 5,000+ civic issues' },
  { year: '2024', title: 'AI Integration', description: 'Launched AI-powered severity classification' },
  { year: '2025', title: '100% Digital Literacy', description: 'Empowering every citizen to use digital governance tools' },
  { year: '2026', title: 'Smart District', description: 'Integrating IoT for automated civic issue detection and resolution' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm shadow-sm mb-6">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Serving Banaskantha</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 tracking-tight leading-tight">
                About <span className="text-gradient">NagrikSetu</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Bridging the gap between citizens and local governance with transparency and efficiency.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal delay={200} className="h-full">
              <Card className="h-full border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:-translate-y-2 ring-1 ring-black/5 group">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4 group-hover:text-primary transition-colors">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To empower every citizen of Banaskantha with a simple, transparent, and efficient
                    platform to report and track civic issues. We believe that active citizen
                    participation is key to building a better community.
                  </p>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay={400} className="h-full">
              <Card className="h-full border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-500 hover:-translate-y-2 ring-1 ring-black/5 group">
                <CardContent className="pt-10 pb-8 px-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Eye className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4 group-hover:text-accent transition-colors">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To transform Banaskantha into a model district where every civic issue is
                    addressed promptly and transparently. We envision a future where technology
                    creates a responsive and accountable governance system.
                  </p>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* About Banaskantha */}
      <section className="py-20 md:py-32 bg-muted/40 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  <span className="text-gradient">Banaskantha</span> District
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  One of Gujarat's largest and most culturally rich districts, serving a diverse and growing population.
                </p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { icon: MapPin, value: '12,703 km²', label: 'Total Area', color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { icon: Users, value: '31 Lakhs+', label: 'Population', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { icon: Building2, value: '14', label: 'Talukas', color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { icon: Shield, value: 'Palanpur', label: 'Headquarters', color: 'text-green-500', bg: 'bg-green-500/10' },
              ].map((stat, index) => (
                <Reveal key={stat.label} delay={index * 100}>
                  <Card className="text-center border-none shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="pt-8 pb-8">
                      <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center mx-auto mb-4`}>
                        <stat.icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                      <p className="text-3xl font-bold mb-1 text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</p>
                    </CardContent>
                  </Card>
                </Reveal>
              ))}
            </div>

            <Reveal threshold={0.2}>
              <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-3xl p-8 md:p-12 text-center border border-border/50 backdrop-blur-sm">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  "Banaskantha is known for its rich cultural heritage, agricultural prosperity, and the famous Ambaji Temple. With a growing population and expanding infrastructure, NagrikSetu ensures efficient civic management is at the core of the district's continued development."
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Our <span className="text-gradient">Values</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The core principles that guide our service to the community
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <Reveal key={value.title} delay={index * 100}>
                <Card className="text-center h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                  <CardContent className="pt-8 pb-8 px-6">
                    <div className="w-16 h-16 rounded-2xl bg-secondary/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                      <value.icon className="h-8 w-8 text-secondary group-hover:text-primary transition-colors duration-500" />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-3">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-32 bg-muted/40 overflow-hidden">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                Our <span className="text-gradient">Journey</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in NagrikSetu's mission to serve
              </p>
            </div>
          </Reveal>

          <div className="max-w-4xl mx-auto relative">
            {/* Vertical Line */}
            <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <Reveal key={index} delay={index * 150} threshold={0.5}>
                  <div className="flex gap-8 relative">
                    <div className="flex flex-col items-center z-10">
                      <div className="w-10 h-10 rounded-full bg-background border-4 border-primary flex items-center justify-center shadow-lg">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="bg-card hover:bg-card/80 p-6 rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{milestone.year}</span>
                          <h3 className="font-display font-bold text-lg">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why NagrikSetu */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                  Why <span className="text-gradient">NagrikSetu</span>?
                </h2>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                'Direct communication channel with district administration',
                'Real-time tracking of issue resolution status',
                'AI-powered severity classification for urgent issues',
                'Photo and GPS-based accurate issue reporting',
                'Transparent dashboard for all reported issues',
                'Mobile-friendly access from anywhere in the district',
              ].map((feature, index) => (
                <Reveal key={index} delay={index * 50} threshold={0.1}>
                  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-lg text-muted-foreground">{feature}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
