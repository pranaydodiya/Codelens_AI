import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Star, GitBranch, Clock, ExternalLink, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/ai-badge';
import { REPOSITORIES } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const languageColors: Record<string, string> = {
  TypeScript: 'bg-info',
  JavaScript: 'bg-warning',
  Python: 'bg-success',
  Go: 'bg-info',
  Swift: 'bg-warning',
  SQL: 'bg-accent',
};

export default function Repositories() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnectOpen, setIsConnectOpen] = useState(false);

  const filteredRepos = REPOSITORIES.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
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
              Manage your connected GitHub repositories
            </p>
          </div>
          <Dialog open={isConnectOpen} onOpenChange={setIsConnectOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Connect Repository
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Connect a Repository</DialogTitle>
                <DialogDescription>
                  Select a GitHub repository to enable AI code reviews.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input placeholder="Search repositories..." />
                <div className="space-y-2">
                  {['acme-corp/new-project', 'acme-corp/backend-api', 'acme-corp/docs'].map(
                    (repo) => (
                      <motion.button
                        key={repo}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
                        onClick={() => setIsConnectOpen(false)}
                      >
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{repo}</span>
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

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

        {/* Repository Grid */}
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
                      <StatusBadge status={repo.status as any} />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {repo.lastScan}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold text-card-foreground">{repo.prs}</div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Open PRs
                        </div>
                      </div>
                      <div className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold text-card-foreground">
                          {repo.reviewedPrs}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          Reviewed
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
