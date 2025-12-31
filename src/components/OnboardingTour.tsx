import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, Zap, LayoutDashboard, GitBranch, Bot, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: string; // CSS selector or area to highlight
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to CodeLens! 🎉',
    description: 'Let\'s take a quick tour to help you get the most out of our AI-powered code review platform.',
    icon: <Sparkles className="h-8 w-8" />,
    position: 'center',
  },
  {
    id: 'dashboard',
    title: 'Your Dashboard',
    description: 'This is your command center. View recent pull requests, code quality metrics, and AI-generated insights all in one place.',
    icon: <LayoutDashboard className="h-8 w-8" />,
    position: 'center',
  },
  {
    id: 'repositories',
    title: 'Repository Management',
    description: 'Connect your GitHub repositories and let AI analyze your codebase. We support TypeScript, Python, Go, and more!',
    icon: <GitBranch className="h-8 w-8" />,
    position: 'center',
  },
  {
    id: 'ai-features',
    title: 'AI-Powered Features',
    description: 'Use our AI Code Summary, Code Generator, and API Playground to supercharge your development workflow.',
    icon: <Bot className="h-8 w-8" />,
    position: 'center',
  },
  {
    id: 'notifications',
    title: 'Real-time Notifications',
    description: 'Stay updated with real-time notifications for code reviews, mentions, and AI insights. Never miss an important update!',
    icon: <Bell className="h-8 w-8" />,
    position: 'center',
  },
  {
    id: 'complete',
    title: 'You\'re All Set!',
    description: 'Start exploring CodeLens and experience the future of code reviews. Need help? Check out our documentation anytime.',
    icon: <Zap className="h-8 w-8" />,
    position: 'center',
  },
];

const STORAGE_KEY = 'codelens-tour-completed';

interface OnboardingTourProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export function OnboardingTour({ forceShow = false, onComplete }: OnboardingTourProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (forceShow) {
      setIsOpen(true);
      setCurrentStep(0);
      return;
    }

    const hasCompletedTour = localStorage.getItem(STORAGE_KEY);
    if (!hasCompletedTour) {
      // Delay to let the page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;
  const step = TOUR_STEPS[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    
    if (isLastStep) {
      handleComplete();
    } else {
      setIsAnimating(true);
      setCurrentStep((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isLastStep, isAnimating]);

  const handlePrevious = useCallback(() => {
    if (isAnimating || isFirstStep) return;
    setIsAnimating(true);
    setCurrentStep((prev) => prev - 1);
    setTimeout(() => setIsAnimating(false), 300);
  }, [isFirstStep, isAnimating]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
    onComplete?.();
  }, [onComplete]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    if (e.key === 'Escape') {
      handleSkip();
    } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
      handleNext();
    } else if (e.key === 'ArrowLeft') {
      handlePrevious();
    }
  }, [isOpen, handleNext, handlePrevious, handleSkip]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={handleSkip}
        />

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>

        {/* Tour Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative z-10 w-full max-w-lg mx-4"
        >
          <Card className="border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden">
            {/* Header with gradient */}
            <div className="relative h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={handleSkip}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Icon */}
              <motion.div
                key={step.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/30">
                  {step.icon}
                </div>
              </motion.div>
            </div>

            <CardContent className="pt-12 pb-6 px-6">
              {/* Progress */}
              <div className="mb-6">
                <Progress value={progress} className="h-1" />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Step {currentStep + 1} of {TOUR_STEPS.length}
                </p>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="text-center space-y-3"
                >
                  <h2 className="text-xl font-bold text-foreground">{step.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              </AnimatePresence>

              {/* Step indicators */}
              <div className="flex justify-center gap-1.5 mt-6">
                {TOUR_STEPS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={cn(
                      'h-2 rounded-full transition-all duration-300',
                      index === currentStep
                        ? 'w-6 bg-primary'
                        : index < currentStep
                        ? 'w-2 bg-primary/50'
                        : 'w-2 bg-muted'
                    )}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={isFirstStep}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-muted-foreground"
                >
                  Skip tour
                </Button>

                <Button
                  size="sm"
                  onClick={handleNext}
                  className="gap-1"
                >
                  {isLastStep ? 'Get Started' : 'Next'}
                  {!isLastStep && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook to control tour from anywhere
export function useTour() {
  const resetTour = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  const hasTourCompleted = () => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  };

  return { resetTour, hasTourCompleted };
}