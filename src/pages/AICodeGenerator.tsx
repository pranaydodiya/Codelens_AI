import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, Loader2, Code, Settings2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BackButton } from '@/components/ui/back-button';
import { AIBadge } from '@/components/ui/ai-badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const generatedCode = `import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const { data: session, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetch('/api/auth/session');
      if (!response.ok) throw new Error('Failed to fetch session');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    onSuccess: (data) => {
      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },
  });

  useEffect(() => {
    if (!isLoading && session) {
      setAuthState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else if (!isLoading) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, [session, isLoading]);

  return {
    ...authState,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,
  };
}`;

const templates = [
  { value: 'hook', label: 'React Hook' },
  { value: 'component', label: 'React Component' },
  { value: 'api', label: 'API Route' },
  { value: 'util', label: 'Utility Function' },
  { value: 'test', label: 'Unit Test' },
];

const languages = [
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
];

export default function AICodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState('hook');
  const [language, setLanguage] = useState('typescript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowCode(true);
    }, 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Wand2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Code Generator</h1>
              <p className="text-muted-foreground text-sm">
                Generate production-ready code from natural language
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Template</label>
                    <Select value={template} onValueChange={setTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">Language</label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Describe what you want to build</label>
                  <Textarea
                    placeholder="Create an authentication hook with login, logout, and session management using React Query..."
                    className="min-h-[200px]"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  className="w-full gap-2"
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Code...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Generate Code
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
            className="lg:col-span-3"
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    Generated Code
                  </CardTitle>
                  {showCode && (
                    <div className="flex items-center gap-2">
                      <AIBadge variant="small" />
                      <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!showCode ? (
                  <div className="h-[500px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Code className="h-12 w-12 mx-auto opacity-20" />
                      <p>Your generated code will appear here</p>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <ScrollArea className="h-[500px]">
                      <pre className="p-4 rounded-lg bg-muted/50 text-sm font-mono overflow-x-auto">
                        <code className="text-foreground">{generatedCode}</code>
                      </pre>
                    </ScrollArea>
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
