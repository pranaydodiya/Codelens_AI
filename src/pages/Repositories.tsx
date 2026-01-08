import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Star, GitBranch, Clock, ExternalLink, Filter, Github, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/ai-badge';
import { useGitHub } from '@/contexts/GitHubContext';
import { GitHubConnect } from '@/components/integrations/GitHubConnect';

const languageColors: Record<string, string> = {
  TypeScript: 'bg-info',
  JavaScript: 'bg-warning',
  Python: 'bg-success',
  Go: 'bg-info',
  Swift: 'bg-warning',
  SQL: 'bg-accent',
  'React Native': 'bg-info',
};

export default function Repositories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const navigate = useNavigate();
  const { isConnected, isLoading, repositories, getConnectedRepos } = useGitHub();

  const connectedRepos = getConnectedRepos();

  const filteredRepos = connectedRepos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <GitHubConnect isOpen={isConnectOpen} onClose={() => setIsConnectOpen(false)} />
      
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Repositories</h1>
            <p className="text-muted-foreground">
              {isConnected 
                ? `${connectedRepos.length} repositories connected for AI reviews`
                : 'Connect GitHub to manage your repositories'}
            </p>
          </div>
          <Button className="gap-2" onClick={() => setIsConnectOpen(true)}>
            {isConnected ? (
              <>
                <Plus className="h-4 w-4" />
                Manage Repositories
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                Connect GitHub
              </>
            )}
          </Button>
        </motion.div>

        {/* Not Connected State */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
              <Github className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your GitHub Account</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Connect your GitHub account to sync repositories and enable AI-powered code reviews on your pull requests.
            </p>
            <Button size="lg" onClick={() => setIsConnectOpen(true)}>
              <Github className="h-4 w-4 mr-2" />
              Connect GitHub
            </Button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-16"
          >
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading repositories...</p>
            </div>
          </motion.div>
        )}

        {/* Connected State */}
        {isConnected && !isLoading && (
          <>
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </motion.div>

            {/* Empty State for Connected */}
            {connectedRepos.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Repositories Connected</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  You haven't connected any repositories yet. Click the button above to select repositories for AI reviews.
                </p>
                <Button onClick={() => setIsConnectOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Repositories
                </Button>
              </motion.div>
            )}

            {/* Repository Grid */}
            {connectedRepos.length > 0 && (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                <AnimatePresence mode="popLayout">
                  {filteredRepos.map((repo) => (
                    <motion.div
                      key={repo.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => navigate(`/repositories/${repo.id}`)}
                    >
                      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
                        <CardContent className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                                <GitBranch className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                                  {repo.name}
                                </h3>
                                <p className="text-xs text-muted-foreground">{repo.fullName}</p>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {repo.description}
                          </p>

                          <div className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                  languageColors[repo.language] || 'bg-muted'
                                }`}
                              />
                              <span className="text-muted-foreground">{repo.language}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-warning" />
                              <span className="text-muted-foreground">{repo.stars}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <StatusBadge status="connected" />
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {repo.lastPush}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
