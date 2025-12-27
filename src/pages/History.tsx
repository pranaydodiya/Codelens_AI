import { motion } from 'framer-motion';
import { Clock, CheckCircle2, AlertCircle, XCircle, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScoreBadge, StatusBadge } from '@/components/ui/ai-badge';
import { REVIEW_HISTORY } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const statusIcons = {
  completed: CheckCircle2,
  pending: Clock,
  failed: XCircle,
};

export default function History() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Review History</h1>
          <p className="text-muted-foreground">
            Timeline of all AI code reviews
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-8">
            {REVIEW_HISTORY.map((review, index) => {
              const Icon = statusIcons[review.status as keyof typeof statusIcons];
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    isLeft ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="absolute left-4 md:left-1/2 md:-translate-x-1/2 z-10"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        review.status === 'completed'
                          ? 'bg-success/20 text-success'
                          : review.status === 'pending'
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                  </motion.div>

                  {/* Card */}
                  <div
                    className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${
                      isLeft ? 'md:mr-auto md:ml-8' : 'md:ml-auto md:mr-8'
                    }`}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <StatusBadge status={review.status as any} />
                              <ScoreBadge score={review.score} />
                            </div>
                            <h3 className="font-medium text-card-foreground line-clamp-1">
                              {review.prTitle}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{review.repo}</span>
                              <span>{review.timestamp}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-destructive">
                                {review.issuesFound} issues
                              </span>
                              <span className="text-success">
                                {review.suggestionsAccepted} accepted
                              </span>
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{review.prTitle}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 rounded-lg bg-muted/50">
                                    <div className="text-2xl font-bold text-foreground">
                                      {review.score ?? '-'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      AI Score
                                    </div>
                                  </div>
                                  <div className="p-4 rounded-lg bg-muted/50">
                                    <div className="text-2xl font-bold text-foreground">
                                      {review.issuesFound}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      Issues Found
                                    </div>
                                  </div>
                                </div>
                                <div className="p-4 rounded-lg border border-border">
                                  <h4 className="font-medium mb-2">Review Summary</h4>
                                  <p className="text-sm text-muted-foreground">
                                    This review identified {review.issuesFound} potential
                                    issues in the codebase. {review.suggestionsAccepted} of
                                    the AI suggestions were accepted and implemented.
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
