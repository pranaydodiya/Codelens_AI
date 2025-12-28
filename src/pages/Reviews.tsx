import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  FileCode,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Sparkles,
  Lightbulb,
  Zap,
  BookOpen,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIBadge, ScoreBadge } from '@/components/ui/ai-badge';
import { BackButton } from '@/components/ui/back-button';
import { AI_REVIEW, CODE_FILES, SAMPLE_CODE } from '@/lib/constants';
import { cn } from '@/lib/utils';

const severityIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityColors = {
  error: 'text-destructive bg-destructive/10 border-destructive/20',
  warning: 'text-warning bg-warning/10 border-warning/20',
  info: 'text-info bg-info/10 border-info/20',
};

interface CollapsibleSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
}

function CollapsibleSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  badge,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium text-card-foreground">{title}</span>
          {badge}
        </div>
        <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Reviews() {
  const [selectedFile, setSelectedFile] = useState(CODE_FILES[0]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BackButton to="/dashboard" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">
                feat: Add user authentication with OAuth2
              </h1>
              <ScoreBadge score={AI_REVIEW.confidence} />
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              PR-1234 · acme-corp/frontend-app · reviewed {AI_REVIEW.reviewTime}
            </p>
          </div>
          <AIBadge />
        </motion.div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* File Tree - Left Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Changed Files</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-2 space-y-1">
                    {CODE_FILES.map((file) => (
                      <motion.button
                        key={file.path}
                        whileHover={{ x: 2 }}
                        onClick={() => setSelectedFile(file)}
                        className={cn(
                          'w-full flex items-center gap-2 p-2 rounded-md text-left text-sm transition-colors',
                          selectedFile.path === file.path
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted'
                        )}
                      >
                        <FileCode className="h-4 w-4 shrink-0" />
                        <div className="truncate flex-1">
                          <div className="truncate font-medium">{file.name}</div>
                          <div className="text-[10px] text-success">{file.changes}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Code Viewer - Center Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6"
          >
            <Card>
              <CardHeader className="border-b border-border pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{selectedFile.path}</span>
                  </div>
                  <span className="text-xs text-success">{selectedFile.changes}</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <pre className="p-4 text-xs font-mono leading-relaxed">
                    <code className="text-foreground">
                      {SAMPLE_CODE.split('\n').map((line, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex hover:bg-muted/30',
                            line.includes('console.log') && 'bg-destructive/10'
                          )}
                        >
                          <span className="w-10 text-right pr-4 text-muted-foreground select-none">
                            {i + 1}
                          </span>
                          <span className="flex-1">{line}</span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Review Panel - Right Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 space-y-4"
          >
            {/* Summary */}
            <CollapsibleSection title="Summary" icon={Sparkles}>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {AI_REVIEW.summary}
              </p>
            </CollapsibleSection>

            {/* Strengths */}
            <CollapsibleSection
              title="Strengths"
              icon={CheckCircle2}
              badge={
                <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full">
                  {AI_REVIEW.strengths.length}
                </span>
              }
            >
              <ul className="space-y-2">
                {AI_REVIEW.strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    {strength}
                  </motion.li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Issues */}
            <CollapsibleSection
              title="Issues"
              icon={AlertCircle}
              badge={
                <span className="text-xs bg-destructive/20 text-destructive px-2 py-0.5 rounded-full">
                  {AI_REVIEW.issues.length}
                </span>
              }
            >
              <div className="space-y-3">
                {AI_REVIEW.issues.map((issue, i) => {
                  const Icon = severityIcons[issue.severity as keyof typeof severityIcons];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={cn(
                        'p-3 rounded-lg border',
                        severityColors[issue.severity as keyof typeof severityColors]
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{issue.title}</div>
                          <p className="text-xs opacity-80">{issue.description}</p>
                          <div className="text-[10px] font-mono opacity-60">
                            {issue.file}:{issue.line}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CollapsibleSection>

            {/* Suggestions */}
            <CollapsibleSection title="Suggestions" icon={Lightbulb} defaultOpen={false}>
              <ul className="space-y-2">
                {AI_REVIEW.suggestions.map((suggestion, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Lightbulb className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    {suggestion}
                  </motion.li>
                ))}
              </ul>
            </CollapsibleSection>

            {/* Improvements */}
            <CollapsibleSection title="Improvements" icon={Zap} defaultOpen={false}>
              <div className="space-y-2">
                {AI_REVIEW.improvements.map((imp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                  >
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
                      {imp.type}
                    </span>
                    <span className="text-sm text-muted-foreground">{imp.description}</span>
                  </motion.div>
                ))}
              </div>
            </CollapsibleSection>

            {/* AI Poem */}
            <CollapsibleSection title="AI Creative Output" icon={BookOpen} defaultOpen={false}>
              <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono italic leading-relaxed">
                  {AI_REVIEW.aiPoem}
                </pre>
              </div>
            </CollapsibleSection>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
