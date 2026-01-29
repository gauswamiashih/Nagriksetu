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
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-secondary-foreground">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              About <span className="text-primary">NagrikSetu</span>
            </h1>
            <p className="text-xl text-secondary-foreground/80">
              Bridging the gap between citizens and local governance in Banaskantha District, Gujarat
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To empower every citizen of Banaskantha with a simple, transparent, and efficient 
                  platform to report and track civic issues. We believe that active citizen 
                  participation is key to building a better community, and NagrikSetu makes this 
                  participation accessible to everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20">
              <CardContent className="pt-8">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                  <Eye className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-display font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To transform Banaskantha into a model district where every civic issue is 
                  addressed promptly and transparently. We envision a future where technology 
                  bridges the gap between citizens and administration, creating a responsive 
                  and accountable governance system.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Banaskantha */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                <span className="text-primary">Banaskantha</span> District
              </h2>
              <p className="text-muted-foreground">
                One of Gujarat's largest districts, serving a diverse population
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { icon: MapPin, value: '12,703 km²', label: 'Area' },
                { icon: Users, value: '31 Lakhs+', label: 'Population' },
                { icon: Building2, value: '14', label: 'Talukas' },
                { icon: Shield, value: 'Palanpur', label: 'Headquarters' },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  Banaskantha is a district in the state of Gujarat, India. It is the fifth largest 
                  district in Gujarat by area. The district headquarters is located at Palanpur. 
                  Named after the Banas River, the district is known for its rich cultural heritage, 
                  agricultural prosperity, and the famous Ambaji Temple. With a growing population 
                  and expanding infrastructure, efficient civic management is crucial for the 
                  district's continued development.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our <span className="text-primary">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at NagrikSetu
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our <span className="text-primary">Journey</span>
            </h2>
            <p className="text-muted-foreground">
              Key milestones in NagrikSetu's growth
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {milestone.year.slice(-2)}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-primary/20 mt-2" />
                    )}
                  </div>
                  <Card className="flex-1 mb-0">
                    <CardContent className="pt-4 pb-4">
                      <p className="text-sm text-primary font-medium">{milestone.year}</p>
                      <h3 className="font-semibold text-lg">{milestone.title}</h3>
                      <p className="text-sm text-muted-foreground">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why NagrikSetu */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Why <span className="text-primary">NagrikSetu</span>?
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Direct communication channel with district administration',
                'Real-time tracking of issue resolution status',
                'AI-powered severity classification for urgent issues',
                'Photo and GPS-based accurate issue reporting',
                'Transparent dashboard for all reported issues',
                'Mobile-friendly access from anywhere in the district',
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
