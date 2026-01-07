import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  FileCode,
  Clock,
  Zap,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';

interface ReviewIssue {
  id: string;
  type: 'error' | 'warning' | 'suggestion' | 'info';
  title: string;
  description: string;
  file: string;
  line: number;
  code?: string;
  suggestion?: string;
}

const mockIssues: ReviewIssue[] = [
  {
    id: '1',
    type: 'error',
    title: 'Potential SQL Injection',
    description: 'User input is directly concatenated into SQL query without sanitization.',
    file: 'src/api/users.ts',
    line: 45,
    code: 'const query = `SELECT * FROM users WHERE id = ${userId}`;',
    suggestion: 'const query = `SELECT * FROM users WHERE id = $1`; // Use parameterized query',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Missing Error Handling',
    description: 'Async function lacks try-catch block which may cause unhandled promise rejections.',
    file: 'src/services/payment.ts',
    line: 78,
    code: 'const result = await processPayment(data);',
    suggestion: 'try {\n  const result = await processPayment(data);\n} catch (error) {\n  handleError(error);\n}',
  },
  {
    id: '3',
    type: 'suggestion',
    title: 'Consider Using useMemo',
    description: 'This expensive computation runs on every render. Consider memoizing the result.',
    file: 'src/components/DataGrid.tsx',
    line: 23,
    code: 'const processedData = data.map(item => expensiveTransform(item));',
    suggestion: 'const processedData = useMemo(() => data.map(item => expensiveTransform(item)), [data]);',
  },
  {
    id: '4',
    type: 'info',
    title: 'Type Annotation Missing',
    description: 'Adding explicit types improves code readability and IDE support.',
    file: 'src/utils/helpers.ts',
    line: 12,
    code: 'function formatDate(date) { ... }',
    suggestion: 'function formatDate(date: Date): string { ... }',
  },
];

export function AIReviewService() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [codeInput, setCodeInput] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<ReviewIssue | null>(null);

  const runAnalysis = () => {
    if (!codeInput.trim()) {
      toast({
        title: 'No Code Provided',
        description: 'Please paste some code to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setIssues([]);

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        clearInterval(interval);
        setProgress(100);
        setIsAnalyzing(false);
        setIssues(mockIssues);
        toast({
          title: 'Analysis Complete',
          description: `Found ${mockIssues.length} issues in your code.`,
        });
      } else {
        setProgress(currentProgress);
      }
    }, 200);

    // Cleanup on unmount - store interval ref
    return () => clearInterval(interval);
  };

  const getIssueIcon = (type: ReviewIssue['type']) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-chart-4" />;
      case 'suggestion': return <Zap className="h-4 w-4 text-chart-1" />;
      case 'info': return <Info className="h-4 w-4 text-chart-2" />;
    }
  };

  const getIssueBadgeVariant = (type: ReviewIssue['type']) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'suggestion': return 'default';
      case 'info': return 'outline';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const issueStats = {
    errors: issues.filter(i => i.type === 'error').length,
    warnings: issues.filter(i => i.type === 'warning').length,
    suggestions: issues.filter(i => i.type === 'suggestion').length,
    info: issues.filter(i => i.type === 'info').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Code Review Service
          </CardTitle>
          <CardDescription>
            Paste your code below to get instant AI-powered code review with suggestions and best practices
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Code Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Code Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your code here for AI analysis..."
              className="min-h-[300px] font-mono text-sm"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
            />
            <Button 
              onClick={runAnalysis} 
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>

            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Analyzing code...</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Checking security vulnerabilities, best practices, and optimizations
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Review Results
              </span>
              {issues.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{issueStats.errors} Errors</Badge>
                  <Badge variant="secondary">{issueStats.warnings} Warnings</Badge>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {issues.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Run an analysis to see results</p>
              </div>
            ) : (
              <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-3">
                  <AnimatePresence>
                    {issues.map((issue, i) => (
                      <motion.div
                        key={issue.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all hover:shadow-md ${
                            selectedIssue?.id === issue.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedIssue(selectedIssue?.id === issue.id ? null : issue)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              {getIssueIcon(issue.type)}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">{issue.title}</span>
                                  <Badge variant={getIssueBadgeVariant(issue.type) as any} className="text-xs">
                                    {issue.type}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">
                                  {issue.description}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <FileCode className="h-3 w-3" />
                                  {issue.file}:{issue.line}
                                </div>

                                <AnimatePresence>
                                  {selectedIssue?.id === issue.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="mt-3 space-y-3 overflow-hidden"
                                    >
                                      {issue.code && (
                                        <div className="space-y-1">
                                          <p className="text-xs font-medium text-destructive">Current Code:</p>
                                          <pre className="p-2 rounded bg-destructive/10 text-xs overflow-x-auto">
                                            <code>{issue.code}</code>
                                          </pre>
                                        </div>
                                      )}
                                      {issue.suggestion && (
                                        <div className="space-y-1">
                                          <p className="text-xs font-medium text-chart-2">Suggested Fix:</p>
                                          <pre className="p-2 rounded bg-chart-2/10 text-xs overflow-x-auto">
                                            <code>{issue.suggestion}</code>
                                          </pre>
                                          <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              copyToClipboard(issue.suggestion!);
                                            }}
                                          >
                                            <Copy className="h-3 w-3 mr-1" />
                                            Copy Fix
                                          </Button>
                                        </div>
                                      )}
                                      <div className="flex items-center gap-2 pt-2 border-t">
                                        <span className="text-xs text-muted-foreground">Was this helpful?</span>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                          <ThumbsUp className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                          <ThumbsDown className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
