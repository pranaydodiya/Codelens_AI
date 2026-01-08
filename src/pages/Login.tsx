import { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { sanitizeRedirectUrl } from '@/lib/security';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();

  // Sanitize the redirect URL to prevent Open Redirect vulnerability
  const rawFrom = (location.state as { from?: { pathname: string } })?.from?.pathname;
  const from = sanitizeRedirectUrl(rawFrom, '/dashboard');

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, from]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
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
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Clerk SignIn Component */}
          <SignIn 
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
            signUpUrl="/signup"
            forceRedirectUrl={from}
          />

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Feature Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-background p-12 border-l border-border">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg space-y-8"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              AI-Powered Code Reviews
            </h2>
            <p className="text-lg text-muted-foreground">
              Get instant, intelligent feedback on your pull requests with our
              advanced AI analysis.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Automatic security vulnerability detection',
              'Performance optimization suggestions',
              'Code style and best practices enforcement',
              'Integration with GitHub, GitLab, and Bitbucket',
            ].map((feature, i) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </motion.div>
            ))}
          </div>

          <Card className="bg-card/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/20">
                  <Sparkles className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <div className="font-medium text-card-foreground">
                    "CodeLens found 3 security issues we missed"
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    — Sarah Chen, Lead Developer at TechCorp
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
