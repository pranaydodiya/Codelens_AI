import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIBadgeProps {
  className?: string;
  variant?: 'default' | 'small';
}

export function AIBadge({ className, variant = 'default' }: AIBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-accent/20 text-accent-foreground',
        variant === 'default' && 'px-3 py-1 text-xs font-medium',
        variant === 'small' && 'px-2 py-0.5 text-[10px] font-medium',
        className
      )}
    >
      <Sparkles className={cn('text-accent', variant === 'default' ? 'h-3 w-3' : 'h-2.5 w-2.5')} />
      <span>AI Generated</span>
    </motion.div>
  );
}

interface ScoreBadgeProps {
  score: number | null;
  className?: string;
}

export function ScoreBadge({ score, className }: ScoreBadgeProps) {
  if (score === null) return null;

  const getColor = () => {
    if (score >= 80) return 'bg-success/20 text-success';
    if (score >= 60) return 'bg-warning/20 text-warning';
    return 'bg-destructive/20 text-destructive';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-bold',
        getColor(),
        className
      )}
    >
      {score}
    </motion.div>
  );
}

interface StatusBadgeProps {
  status: 'connected' | 'pending' | 'error' | 'reviewed' | 'failed' | 'completed';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case 'connected':
      case 'completed':
      case 'reviewed':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'error':
      case 'failed':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        getStyles(),
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
