import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  delay?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  delay = 0,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, translateY: -2 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: delay + 0.2 }}
            className="text-3xl font-bold text-card-foreground"
          >
            {value}
          </motion.p>
          {change && (
            <p
              className={cn(
                'text-xs font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-primary/5" />
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-muted animate-shimmer" />
          <div className="h-8 w-32 rounded bg-muted animate-shimmer" />
          <div className="h-3 w-16 rounded bg-muted animate-shimmer" />
        </div>
        <div className="h-10 w-10 rounded-lg bg-muted animate-shimmer" />
      </div>
    </div>
  );
}
