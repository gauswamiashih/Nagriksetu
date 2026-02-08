<<<<<<< HEAD
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold">NagrikSetu</span>
                <span className="text-xs text-secondary-foreground/70">Banaskantha District</span>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              Connecting citizens with local governance for a better Banaskantha.
              Report issues, track progress, and build a stronger community together.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/services', label: 'Services' },
                { href: '/report', label: 'Report Issue' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold mb-4">Report Issues</h3>
            <ul className="space-y-2">
              {[
                'Road & Potholes',
                'Water Supply',
                'Electricity',
                'Garbage & Sanitation',
                'Street Lights',
                'Drainage',
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-secondary-foreground/80">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>District Collector Office, Palanpur, Banaskantha - 385001, Gujarat</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+91 96645 92743</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Mail className="h-5 w-5 shrink-0" />
                <span>gauswamiashish760@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/70">
              © {new Date().getFullYear()} NagrikSetu - Banaskantha District. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
=======
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold">NagrikSetu</span>
                <span className="text-xs text-secondary-foreground/70">Banaskantha District</span>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/80">
              Connecting citizens with local governance for a better Banaskantha.
              Report issues, track progress, and build a stronger community together.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/services', label: 'Services' },
                { href: '/report', label: 'Report Issue' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-secondary-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display font-semibold mb-4">Report Issues</h3>
            <ul className="space-y-2">
              {[
                'Road & Potholes',
                'Water Supply',
                'Electricity',
                'Garbage & Sanitation',
                'Street Lights',
                'Drainage',
              ].map((service) => (
                <li key={service}>
                  <span className="text-sm text-secondary-foreground/80">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-secondary-foreground/80">
                <MapPin className="h-5 w-5 shrink-0 mt-0.5" />
                <span>District Collector Office, Palanpur, Banaskantha - 385001, Gujarat</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+91 96645 92743</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-secondary-foreground/80">
                <Mail className="h-5 w-5 shrink-0" />
                <span>gauswamiashish760@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-secondary-foreground/70">
              © {new Date().getFullYear()} NagrikSetu - Banaskantha District. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
>>>>>>> 0251dfea8c914f952057908c07daaf9cec5b8ee2
