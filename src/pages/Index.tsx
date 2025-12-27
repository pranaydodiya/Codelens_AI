import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check, GitBranch, Shield, Zap, BarChart3, Code, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  { icon: Shield, title: 'Security Analysis', description: 'Detect vulnerabilities before they reach production' },
  { icon: Zap, title: 'Instant Reviews', description: 'Get AI feedback in seconds, not hours' },
  { icon: BarChart3, title: 'Analytics', description: 'Track code quality trends over time' },
  { icon: Code, title: 'Smart Suggestions', description: 'Actionable improvements for better code' },
];

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
            <Link to="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Code Reviews</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Ship Better Code,{' '}
              <span className="text-primary">Faster</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              CodeLens analyzes your pull requests with advanced AI, finding bugs, security issues, and improvements in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/signup">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <GitBranch className="h-4 w-4" />
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need for smarter code reviews</p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-background border border-border"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to improve your code?</h2>
            <p className="text-muted-foreground mb-8">Join thousands of developers using AI-powered reviews.</p>
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>CodeLens © 2024</span>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
