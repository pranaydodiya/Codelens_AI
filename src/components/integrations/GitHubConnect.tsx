import { motion } from 'framer-motion';
import { Github, Check, RefreshCw, GitBranch, Users, Lock, Star, GitFork } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useGitHub } from '@/contexts/GitHubContext';

interface GitHubConnectProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubConnect({ isOpen, onClose }: GitHubConnectProps) {
  const { 
    isConnected, 
    isLoading, 
    account, 
    repositories, 
    connect, 
    disconnect, 
    toggleRepository, 
    syncRepositories 
  } = useGitHub();

  const handleConnect = async () => {
    await connect();
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
              <Button onClick={handleConnect} disabled={isLoading} size="lg">
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
                      <p className="font-medium">@{account?.username}</p>
                      <p className="text-sm text-muted-foreground">{account?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-chart-2 border-chart-2">
                      <Check className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={syncRepositories} disabled={isLoading}>
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
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {repo.private ? (
                                <Lock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              ) : (
                                <GitBranch className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="font-medium truncate">{repo.fullName}</span>
                              <Badge variant="secondary" className="text-xs flex-shrink-0">
                                {repo.language}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {repo.stars}
                              </span>
                              <span className="flex items-center gap-1">
                                <GitFork className="h-3 w-3" />
                                {repo.forks}
                              </span>
                              <span>{repo.lastPush}</span>
                            </div>
                          </div>
                          <Switch
                            checked={repo.connected}
                            onCheckedChange={() => toggleRepository(repo.id)}
                          />
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
            <Button variant="destructive" onClick={disconnect} className="w-full sm:w-auto">
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
