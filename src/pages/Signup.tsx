import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Check, Users, TrendingUp, Shield } from 'lucide-react';
import { SignUp, useAuth } from '@clerk/clerk-react';

export default function Signup() {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/onboarding', { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const stats = [
    { icon: Users, value: '50K+', label: 'Developers' },
    { icon: TrendingUp, value: '10M+', label: 'Reviews' },
    { icon: Shield, value: '99.9%', label: 'Uptime' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-background p-12 border-r border-border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Join thousands of developers
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started with AI-powered code reviews and improve your code quality instantly.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="text-center"
              >
                <div className="flex justify-center mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4">
            {[
              'Free tier with 100 reviews/month',
              'No credit card required',
              'Connect unlimited public repositories',
              'Real-time code analysis',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-chart-2/20">
                  <Check className="h-3.5 w-3.5 text-chart-2" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CodeLens</span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Create an account</h1>
            <p className="text-muted-foreground mt-2">
              Start reviewing code with AI in minutes
            </p>
          </div>

          {/* Clerk SignUp Component */}
          <SignUp 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-card border-border shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-background border-border text-foreground hover:bg-muted',
                formButtonPrimary: 'bg-primary hover:bg-primary/90',
                formFieldInput: 'bg-background border-border text-foreground',
                formFieldLabel: 'text-foreground',
                footerActionLink: 'text-primary hover:text-primary/90',
                identityPreviewText: 'text-foreground',
                identityPreviewEditButton: 'text-primary',
              },
            }}
            signInUrl="/login"
            forceRedirectUrl="/onboarding"
          />

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
