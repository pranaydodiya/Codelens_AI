import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Check, ExternalLink, RefreshCw, GitBranch, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface Repository {
  id: string;
  name: string;
  fullName: string;
  private: boolean;
  language: string;
  lastPush: string;
  connected: boolean;
}

const mockRepositories: Repository[] = [
  { id: '1', name: 'frontend-app', fullName: 'acme/frontend-app', private: false, language: 'TypeScript', lastPush: '2 hours ago', connected: true },
  { id: '2', name: 'backend-api', fullName: 'acme/backend-api', private: true, language: 'Python', lastPush: '5 hours ago', connected: true },
  { id: '3', name: 'mobile-app', fullName: 'acme/mobile-app', private: false, language: 'React Native', lastPush: '1 day ago', connected: false },
  { id: '4', name: 'data-pipeline', fullName: 'acme/data-pipeline', private: true, language: 'Go', lastPush: '3 days ago', connected: false },
];

interface GitHubConnectProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubConnect({ isOpen, onClose }: GitHubConnectProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [repositories, setRepositories] = useState(mockRepositories);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleGitHubAuth = () => {
    setIsLoading(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast({
        title: 'GitHub Connected',
        description: 'Successfully connected to your GitHub account.',
      });
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRepositories(mockRepositories.map(r => ({ ...r, connected: false })));
    toast({
      title: 'GitHub Disconnected',
      description: 'Your GitHub account has been disconnected.',
    });
  };

  const toggleRepository = (repoId: string) => {
    setRepositories(prev =>
      prev.map(repo =>
        repo.id === repoId ? { ...repo, connected: !repo.connected } : repo
      )
    );
    const repo = repositories.find(r => r.id === repoId);
    if (repo) {
      toast({
        title: repo.connected ? 'Repository Disconnected' : 'Repository Connected',
        description: `${repo.fullName} has been ${repo.connected ? 'removed from' : 'added to'} CodeLens.`,
      });
    }
  };

  const handleSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Repositories Synced',
        description: 'All connected repositories have been synchronized.',
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            GitHub Integration
          </DialogTitle>
          <DialogDescription>
            Connect your GitHub account to sync repositories and enable AI code reviews
          </DialogDescription>
        </DialogHeader>

        {!isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-8 text-center space-y-6"
          >
            <div className="mx-auto h-20 w-20 rounded-full bg-muted flex items-center justify-center">
              <Github className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connect to GitHub</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Authorize CodeLens to access your repositories and enable automatic AI code reviews on pull requests.
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={handleGitHubAuth} disabled={isLoading} size="lg">
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Github className="h-4 w-4 mr-2" />
                )}
                Authorize GitHub
              </Button>
              <p className="text-xs text-muted-foreground">
                We'll request read access to your repositories and write access for PR comments.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Connected Account */}
            <Card className="border-chart-2/30 bg-chart-2/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Github className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">@acme-developer</p>
                      <p className="text-sm text-muted-foreground">Connected 3 months ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-chart-2 border-chart-2">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={handleSync} disabled={isLoading}>
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Repositories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Repositories
                </h3>
                <span className="text-sm text-muted-foreground">
                  {repositories.filter(r => r.connected).length} connected
                </span>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {repositories.map((repo, i) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              {repo.private ? (
                                <Lock className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <GitBranch className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium">{repo.fullName}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {repo.language}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">{repo.lastPush}</span>
                            <Switch
                              checked={repo.connected}
                              onCheckedChange={() => toggleRepository(repo.id)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Permissions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Read repository contents</p>
                    <p className="text-xs text-muted-foreground">Access code and file contents</p>
                  </div>
                  <Check className="h-4 w-4 text-chart-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Read pull requests</p>
                    <p className="text-xs text-muted-foreground">View PR details and diffs</p>
                  </div>
                  <Check className="h-4 w-4 text-chart-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Write PR comments</p>
                    <p className="text-xs text-muted-foreground">Post AI review feedback</p>
                  </div>
                  <Check className="h-4 w-4 text-chart-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isConnected && (
            <Button variant="destructive" onClick={handleDisconnect} className="w-full sm:w-auto">
              Disconnect GitHub
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
