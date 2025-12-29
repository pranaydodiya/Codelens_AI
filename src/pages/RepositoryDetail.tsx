import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GitBranch, Star, Clock, Users, GitPullRequest, 
  CheckCircle2, AlertCircle, TrendingUp, Settings,
  ExternalLink, Activity, Shield, Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BackButton } from '@/components/ui/back-button';
import { StatusBadge } from '@/components/ui/ai-badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { REPOSITORIES, PULL_REQUESTS } from '@/lib/constants';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const languageColors: Record<string, string> = {
  TypeScript: 'bg-info',
  JavaScript: 'bg-warning',
  Python: 'bg-success',
  Go: 'bg-info',
  Swift: 'bg-warning',
  SQL: 'bg-accent',
};

// Mock activity data for the repository
const activityData = [
  { date: 'Mon', commits: 12, reviews: 8 },
  { date: 'Tue', commits: 19, reviews: 15 },
  { date: 'Wed', commits: 15, reviews: 12 },
  { date: 'Thu', commits: 25, reviews: 20 },
  { date: 'Fri', commits: 22, reviews: 18 },
  { date: 'Sat', commits: 8, reviews: 5 },
  { date: 'Sun', commits: 5, reviews: 3 },
];

// Mock contributors
const contributors = [
  { name: 'Sarah Chen', avatar: 'SC', commits: 145, reviews: 89 },
  { name: 'Mike Johnson', avatar: 'MJ', commits: 98, reviews: 67 },
  { name: 'Alex Kim', avatar: 'AK', commits: 76, reviews: 54 },
  { name: 'Emma Wilson', avatar: 'EW', commits: 54, reviews: 43 },
  { name: 'David Lee', avatar: 'DL', commits: 32, reviews: 21 },
];

// Mock AI statistics
const aiStats = {
  totalReviews: 245,
  avgScore: 87,
  issuesFound: 156,
  issuesResolved: 142,
  avgReviewTime: '1.8s',
  securityIssues: 12,
  performanceIssues: 34,
  styleIssues: 67,
};

export default function RepositoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const repo = REPOSITORIES.find((r) => r.id === id);
  
  if (!repo) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
          <AlertCircle className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-foreground">Repository not found</h2>
          <Button onClick={() => navigate('/repositories')}>Back to Repositories</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <BackButton to="/repositories" label="Back to Repositories" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
              <GitBranch className="h-8 w-8 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">{repo.name}</h1>
                <StatusBadge status={repo.status as any} />
              </div>
              <p className="text-muted-foreground">{repo.fullName}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className={`h-3 w-3 rounded-full ${languageColors[repo.language] || 'bg-muted'}`} />
                  <span className="text-muted-foreground">{repo.language}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning" />
                  <span className="text-muted-foreground">{repo.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last scan: {repo.lastScan}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Open PRs', value: repo.prs, icon: GitPullRequest, color: 'text-info' },
            { label: 'Reviewed', value: repo.reviewedPrs, icon: CheckCircle2, color: 'text-success' },
            { label: 'AI Score', value: `${aiStats.avgScore}%`, icon: Zap, color: 'text-warning' },
            { label: 'Contributors', value: contributors.length, icon: Users, color: 'text-primary' },
          ].map((stat, index) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prs">Pull Requests</TabsTrigger>
            <TabsTrigger value="ai-stats">AI Statistics</TabsTrigger>
            <TabsTrigger value="contributors">Contributors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Activity Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Weekly Activity
                  </CardTitle>
                  <CardDescription>Commits and reviews over the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="commits"
                          stroke="hsl(var(--primary))"
                          fill="url(#colorCommits)"
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="reviews"
                          stroke="hsl(var(--success))"
                          fill="url(#colorReviews)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* AI Review Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Review Summary
                  </CardTitle>
                  <CardDescription>Overall code quality analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average AI Score</span>
                    <span className="text-2xl font-bold text-foreground">{aiStats.avgScore}%</span>
                  </div>
                  <Progress value={aiStats.avgScore} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Issues Found</p>
                      <p className="text-lg font-semibold text-foreground">{aiStats.issuesFound}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Issues Resolved</p>
                      <p className="text-lg font-semibold text-success">{aiStats.issuesResolved}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Total Reviews</p>
                      <p className="text-lg font-semibold text-foreground">{aiStats.totalReviews}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Avg Review Time</p>
                      <p className="text-lg font-semibold text-foreground">{aiStats.avgReviewTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pull Requests Tab */}
          <TabsContent value="prs">
            <Card>
              <CardHeader>
                <CardTitle>Recent Pull Requests</CardTitle>
                <CardDescription>All pull requests for this repository</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pull Request</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {PULL_REQUESTS.map((pr) => (
                      <TableRow key={pr.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">{pr.title}</p>
                            <p className="text-xs text-muted-foreground">{pr.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                              {pr.authorAvatar}
                            </div>
                            <span className="text-sm text-muted-foreground">{pr.author}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={pr.status} />
                        </TableCell>
                        <TableCell>
                          {pr.aiScore ? (
                            <span className={`font-semibold ${
                              pr.aiScore >= 80 ? 'text-success' : 
                              pr.aiScore >= 60 ? 'text-warning' : 'text-destructive'
                            }`}>
                              {pr.aiScore}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-success">+{pr.additions}</span>
                            <span className="text-destructive">-{pr.deletions}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {pr.createdAt}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Statistics Tab */}
          <TabsContent value="ai-stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Security Issues</p>
                      <p className="text-2xl font-bold text-foreground">{aiStats.securityIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Performance Issues</p>
                      <p className="text-2xl font-bold text-foreground">{aiStats.performanceIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                      <Activity className="h-6 w-6 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Style Issues</p>
                      <p className="text-2xl font-bold text-foreground">{aiStats.styleIssues}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Issue Resolution Rate</CardTitle>
                <CardDescription>Track how many AI-detected issues have been resolved</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {aiStats.issuesResolved} of {aiStats.issuesFound} issues resolved
                    </span>
                    <span className="font-medium text-foreground">
                      {Math.round((aiStats.issuesResolved / aiStats.issuesFound) * 100)}%
                    </span>
                  </div>
                  <Progress value={(aiStats.issuesResolved / aiStats.issuesFound) * 100} className="h-3" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Most active contributors in this repository</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributors.map((contributor, index) => (
                    <motion.div
                      key={contributor.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-medium text-primary-foreground">
                          {contributor.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{contributor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {contributor.commits} commits • {contributor.reviews} reviews
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
