import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Sparkles, ArrowRight, GitBranch, Shield, Zap, BarChart3, Code, Quote, FileCode, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useRef } from 'react';

const features = [
  { icon: Shield, title: 'Security Analysis', description: 'Detect vulnerabilities before they reach production' },
  { icon: Zap, title: 'Instant Reviews', description: 'Get AI feedback in seconds, not hours' },
  { icon: BarChart3, title: 'Analytics', description: 'Track code quality trends over time' },
  { icon: Code, title: 'Smart Suggestions', description: 'Actionable improvements for better code' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Senior Engineer at Stripe', quote: 'CodeLens cut our review time by 60%. The AI catches bugs we would have missed.', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Tech Lead at Vercel', quote: 'Best investment for our team. The security analysis alone saved us from 3 potential vulnerabilities.', avatar: 'MJ' },
  { name: 'Emily Rodriguez', role: 'CTO at Notion', quote: 'We shipped 2x faster after adopting CodeLens. The AI suggestions are genuinely helpful.', avatar: 'ER' },
];

const trustedCompanies = ['Stripe', 'Vercel', 'Notion', 'Linear', 'Figma', 'Supabase'];

const stats = [
  { value: 10000, suffix: '+', label: 'Developers' },
  { value: 1000000, suffix: '+', label: 'Reviews' },
  { value: 99, suffix: '%', label: 'Satisfaction' },
  { value: 50, suffix: '%', label: 'Faster Reviews' },
];

const howItWorks = [
  { step: 1, title: 'Connect Repository', description: 'Link your GitHub or GitLab in seconds', icon: GitBranch },
  { step: 2, title: 'Push Code', description: 'Open a PR and trigger AI analysis', icon: FileCode },
  { step: 3, title: 'Get Insights', description: 'Receive detailed feedback instantly', icon: CheckCircle },
];

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (value >= 1000000) return `${Math.round(latest / 1000000)}M`;
    if (value >= 1000) return `${Math.round(latest / 1000)}K`;
    return Math.round(latest).toString();
  });
  const ref = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
      animate(count, value, { duration: 2, ease: 'easeOut' });
    }
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
}

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">CodeLens</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
            <Link to="/signup"><Button>Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Code Reviews</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Ship Better Code, <span className="text-primary">Faster</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              CodeLens analyzes your pull requests with advanced AI, finding bugs, security issues, and improvements in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/signup"><Button size="lg" className="gap-2 w-full sm:w-auto">Start Free Trial<ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/dashboard"><Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto"><GitBranch className="h-4 w-4" />View Demo</Button></Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need for smarter code reviews</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center"><feature.icon className="h-6 w-6 text-primary" /></div>
                    <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 border-y border-border bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary"><AnimatedCounter value={stat.value} />{stat.suffix}</div>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-sm text-muted-foreground mb-6">Trusted by developers at</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-60">
            {trustedCompanies.map((company) => (<span key={company} className="text-lg font-semibold text-foreground">{company}</span>))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="text-muted-foreground mt-2">Get started in 3 simple steps</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center p-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"><step.icon className="h-8 w-8 text-primary" /></div>
                <div className="absolute top-8 left-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">{step.step}</div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Loved by Developers</h2>
            <p className="text-muted-foreground mt-2">See what our users have to say</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div key={testimonial.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full"><CardContent className="p-6 space-y-4">
                  <Quote className="h-8 w-8 text-primary/30" />
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3 pt-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">{testimonial.avatar}</div>
                    <div><p className="font-medium text-card-foreground">{testimonial.name}</p><p className="text-xs text-muted-foreground">{testimonial.role}</p></div>
                  </div>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-background border border-border">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to improve your code?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of developers using AI-powered reviews.</p>
            <Link to="/signup"><Button size="lg" className="gap-2">Get Started Free<ArrowRight className="h-4 w-4" /></Button></Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col items-center gap-4 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4" /><span>CodeLens © 2024</span></div>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div className="text-center text-xs text-muted-foreground/70">Made with ❤️ by <span className="font-medium text-primary">Pranay Dodiya</span></div>
        </div>
      </footer>
    </div>
  );
}
