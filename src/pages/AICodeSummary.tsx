import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileCode, Copy, Check, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BackButton } from '@/components/ui/back-button';
import { AIBadge } from '@/components/ui/ai-badge';
import { sanitizeInput } from '@/lib/security';
import { useClipboard } from '@/hooks/useClipboard';
import { useAISummary, type CodeSummaryResponse } from '@/hooks/useAISummary';

export default function AICodeSummary() {
  const [code, setCode] = useState('');
  const [summary, setSummary] = useState<CodeSummaryResponse | null>(null);
  const { copied, copyToClipboard } = useClipboard();
  const { mutate: generateSummary, isPending: isGenerating } = useAISummary();

  const handleGenerate = () => {
    const trimmedCode = code.trim();
    if (!trimmedCode) return;
    
    // Sanitize user input before processing
    const sanitizedCode = sanitizeInput(trimmedCode);
    if (!sanitizedCode) return;

    generateSummary(
      { code: sanitizedCode },
      {
        onSuccess: (data) => {
          setSummary(data);
        },
      }
    );
  };

  const handleCopy = () => {
    if (summary) {
      copyToClipboard(JSON.stringify(summary, null, 2), 'Summary copied to clipboard');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <BackButton to="/dashboard" />
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Code Summary</h1>
              <p className="text-muted-foreground text-sm">
                Generate intelligent summaries of your code with AI
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-4 w-4" />
                  Paste Your Code
                </CardTitle>
                <CardDescription>
                  Enter code to generate an AI-powered summary
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="// Paste your code here...
const handleAuth = async () => {
  const token = await fetchToken();
  // ...
}"
                  className="min-h-[400px] font-mono text-sm"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button 
                  onClick={handleGenerate} 
                  className="w-full gap-2"
                  disabled={isGenerating || !code.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Summary
                  </CardTitle>
                  {summary && <AIBadge variant="small" />}
                </div>
              </CardHeader>
              <CardContent>
                {!summary ? (
                  <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Sparkles className="h-12 w-12 mx-auto opacity-20" />
                      <p>Your AI summary will appear here</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                        <h3 className="font-semibold text-foreground mb-2">{summary.title}</h3>
                        <p className="text-muted-foreground">{summary.overview}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <div className="text-lg font-bold text-foreground">{summary.linesOfCode}</div>
                          <div className="text-xs text-muted-foreground">Lines</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <div className="text-lg font-bold text-foreground">{summary.functions}</div>
                          <div className="text-xs text-muted-foreground">Functions</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 text-center">
                          <div className="text-lg font-bold text-primary">{summary.complexity}</div>
                          <div className="text-xs text-muted-foreground">Complexity</div>
                        </div>
                      </div>
                      
                      {summary.keyComponents.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Key Components</h4>
                          <ul className="space-y-1">
                            {summary.keyComponents.map((comp, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {comp}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {summary.dependencies.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Dependencies</h4>
                          <div className="flex flex-wrap gap-2">
                            {summary.dependencies.map((dep, i) => (
                              <span key={i} className="px-2 py-1 rounded bg-muted text-xs text-muted-foreground">
                                {dep}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {summary.securityNotes.length > 0 && (
                        <div>
                          <h4 className="font-medium text-foreground mb-2">Security Notes</h4>
                          <ul className="space-y-1">
                            {summary.securityNotes.map((note, i) => (
                              <li key={i} className="text-muted-foreground flex items-start gap-2">
                                <span className="text-success">✓</span>
                                {note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
