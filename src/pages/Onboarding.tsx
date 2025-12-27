import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, GitBranch, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Connect GitHub', description: 'Link your GitHub account' },
  { id: 2, title: 'Select Repositories', description: 'Choose repos to analyze' },
  { id: 3, title: 'Configure AI', description: 'Set your preferences' },
];

const MOCK_REPOS = [
  { id: '1', name: 'frontend-app', owner: 'acme-corp', language: 'TypeScript' },
  { id: '2', name: 'api-gateway', owner: 'acme-corp', language: 'Go' },
  { id: '3', name: 'ml-pipeline', owner: 'acme-corp', language: 'Python' },
  { id: '4', name: 'mobile-sdk', owner: 'acme-corp', language: 'Swift' },
  { id: '5', name: 'design-system', owner: 'acme-corp', language: 'TypeScript' },
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const progress = (step / STEPS.length) * 100;

  const filteredRepos = MOCK_REPOS.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const toggleRepo = (id: string) => {
    setSelectedRepos((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">CodeLens</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            Skip setup
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border">
        <div className="max-w-3xl mx-auto p-4">
          <Progress value={progress} className="h-1" />
          <div className="flex justify-between mt-4">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={cn(
                  'flex items-center gap-2',
                  step >= s.id ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                    step > s.id
                      ? 'bg-primary text-primary-foreground'
                      : step === s.id
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {step > s.id ? <Check className="h-3 w-3" /> : s.id}
                </div>
                <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md text-center space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Connect Your GitHub</h1>
                <p className="text-muted-foreground">
                  Link your GitHub account to start analyzing your repositories
                </p>
              </div>

              <Card className="p-8">
                <CardContent className="p-0 space-y-6">
                  <div className="h-24 w-24 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                    <GitBranch className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <Button className="w-full gap-2" onClick={handleNext}>
                    <GitBranch className="h-4 w-4" />
                    Connect GitHub Account
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    We only request read access to your repositories
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">Select Repositories</h1>
                <p className="text-muted-foreground">
                  Choose which repositories you want to analyze with AI
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {filteredRepos.map((repo, index) => (
                  <motion.button
                    key={repo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleRepo(repo.id)}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-lg border transition-colors text-left',
                      selectedRepos.includes(repo.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium text-foreground">{repo.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {repo.owner} · {repo.language}
                        </div>
                      </div>
                    </div>
                    <div
                      className={cn(
                        'h-5 w-5 rounded border-2 flex items-center justify-center transition-colors',
                        selectedRepos.includes(repo.id)
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      )}
                    >
                      {selectedRepos.includes(repo.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              <p className="text-sm text-muted-foreground text-center">
                {selectedRepos.length} repositories selected
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-md text-center space-y-8"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">You're All Set!</h1>
                <p className="text-muted-foreground">
                  CodeLens is now configured and ready to analyze your code
                </p>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="h-32 w-32 mx-auto rounded-full bg-success/20 flex items-center justify-center"
              >
                <Sparkles className="h-16 w-16 text-success" />
              </motion.div>

              <div className="space-y-4">
                {[
                  'GitHub account connected',
                  `${selectedRepos.length || 3} repositories configured`,
                  'AI review settings optimized',
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-center gap-3 justify-center"
                  >
                    <div className="h-5 w-5 rounded-full bg-success/20 flex items-center justify-center">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border p-4">
        <div className="max-w-3xl mx-auto flex justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} className="gap-2">
            {step === STEPS.length ? 'Go to Dashboard' : 'Continue'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
