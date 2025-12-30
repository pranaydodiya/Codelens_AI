import { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Keyboard, MessageSquare, Search, ChevronRight, ExternalLink } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const gettingStartedSteps = [
  { step: 1, title: 'Connect Repository', description: 'Link your GitHub or GitLab repositories to start analyzing code.' },
  { step: 2, title: 'Configure Settings', description: 'Set up review preferences, notification channels, and team members.' },
  { step: 3, title: 'Get AI Reviews', description: 'Push code or open PRs to automatically receive AI-powered reviews.' },
];

const faqs = [
  { q: 'How does the AI code review work?', a: 'Our AI analyzes your code changes, looking for bugs, security vulnerabilities, performance issues, and style inconsistencies. It provides actionable suggestions to improve code quality.' },
  { q: 'Which programming languages are supported?', a: 'We support all major programming languages including JavaScript, TypeScript, Python, Go, Rust, Java, C++, and many more. The AI adapts its analysis based on the language and framework.' },
  { q: 'How is my code kept secure?', a: 'Your code is encrypted in transit and at rest. We never store your code longer than necessary for analysis, and our systems are SOC 2 compliant.' },
  { q: 'Can I customize the review rules?', a: 'Yes! You can configure custom rules, ignore specific files or patterns, and adjust the sensitivity of different issue categories in your project settings.' },
  { q: 'How do I integrate with CI/CD?', a: 'We provide GitHub Actions, GitLab CI, and generic webhooks for seamless CI/CD integration. Check our documentation for setup guides.' },
];

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['⌘', 'K'], action: 'Open command search' },
    { keys: ['G', 'D'], action: 'Go to Dashboard' },
    { keys: ['G', 'R'], action: 'Go to Repositories' },
    { keys: ['G', 'P'], action: 'Go to Pull Requests' },
  ]},
  { category: 'Actions', items: [
    { keys: ['⌘', 'Enter'], action: 'Submit form' },
    { keys: ['Esc'], action: 'Close modal' },
    { keys: ['?'], action: 'Show keyboard shortcuts' },
  ]},
  { category: 'AI Features', items: [
    { keys: ['⌘', 'G'], action: 'Open AI Generator' },
    { keys: ['⌘', 'S'], action: 'Open AI Summary' },
  ]},
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmitSupport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Message Sent', description: 'Our support team will get back to you soon.' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Help & Documentation</h1>
            <p className="text-sm text-muted-foreground">Learn how to use CodeLens effectively</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-0"
          />
        </div>

        {/* Getting Started */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Getting Started
            </CardTitle>
            <CardDescription>Quick steps to get up and running with CodeLens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {gettingStartedSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative p-4 rounded-lg bg-secondary"
                >
                  <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-3">
                    {step.step}
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {i < gettingStartedSteps.length - 1 && (
                    <ChevronRight className="hidden sm:block absolute top-1/2 -right-6 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-primary" />
                Keyboard Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {shortcuts.map((section) => (
                <div key={section.category}>
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">{section.category}</h4>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-foreground">{item.action}</span>
                        <div className="flex gap-1">
                          {item.keys.map((key, j) => (
                            <kbd key={j} className="px-2 py-1 text-xs rounded bg-secondary border border-border font-mono">
                              {key}
                            </kbd>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Contact Support
            </CardTitle>
            <CardDescription>Need more help? Send us a message</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitSupport} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What do you need help with?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue in detail..." rows={4} />
              </div>
              <div className="flex gap-3">
                <Button type="submit">Send Message</Button>
                <Button type="button" variant="outline" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Docs
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
