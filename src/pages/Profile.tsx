import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  Github, 
  Twitter,
  Edit,
  Settings,
  Award,
  GitPullRequest,
  Code,
  Star,
  TrendingUp
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { STATS, REPOSITORIES } from '@/lib/constants';

const Profile = () => {
  const user = {
    name: 'Pranay Dodiya',
    email: 'pranay@codewhisper.dev',
    role: 'Senior Developer',
    location: 'San Francisco, CA',
    joinedDate: 'January 2024',
    bio: 'Full-stack developer passionate about AI-powered development tools and clean code.',
    website: 'https://pranaydodiya.dev',
    github: 'pranaydodiya',
    twitter: 'pranaydodiya',
  };

  const achievements = [
    { name: 'Early Adopter', description: 'Joined during beta', icon: Award, color: 'text-yellow-400' },
    { name: 'Code Master', description: '100+ reviews completed', icon: Code, color: 'text-blue-400' },
    { name: 'Team Player', description: 'Invited 5+ team members', icon: User, color: 'text-green-400' },
    { name: 'Streak Keeper', description: '30-day review streak', icon: TrendingUp, color: 'text-purple-400' },
  ];

  const recentActivity = [
    { action: 'Reviewed PR', target: 'Add authentication flow', repo: 'frontend-app', time: '2 hours ago' },
    { action: 'Connected repo', target: 'api-service', repo: 'api-service', time: '1 day ago' },
    { action: 'Approved PR', target: 'Fix memory leak in worker', repo: 'backend-core', time: '2 days ago' },
    { action: 'Generated code', target: 'User dashboard component', repo: 'frontend-app', time: '3 days ago' },
  ];

  // Generate contribution data for the graph
  const contributionData = Array.from({ length: 52 }, () =>
    Array.from({ length: 7 }, () => Math.floor(Math.random() * 5))
  );

  const getContributionColor = (level: number) => {
    const colors = [
      'bg-muted/30',
      'bg-primary/20',
      'bg-primary/40',
      'bg-primary/60',
      'bg-primary/80',
    ];
    return colors[level] || colors[0];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <CardContent className="relative pb-6">
              <div className="flex flex-col md:flex-row gap-6 -mt-16">
                <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                  <AvatarFallback className="text-4xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 pt-4 md:pt-8">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                      <p className="text-muted-foreground">{user.role}</p>
                      <p className="text-sm text-muted-foreground mt-2 max-w-lg">{user.bio}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {user.joinedDate}
                    </span>
                    <a href={user.website} className="flex items-center gap-1 text-primary hover:underline">
                      <LinkIcon className="h-4 w-4" />
                      Website
                    </a>
                    <a href={`https://github.com/${user.github}`} className="flex items-center gap-1 hover:text-foreground">
                      <Github className="h-4 w-4" />
                      {user.github}
                    </a>
                    <a href={`https://twitter.com/${user.twitter}`} className="flex items-center gap-1 hover:text-foreground">
                      <Twitter className="h-4 w-4" />
                      {user.twitter}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <GitPullRequest className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{STATS.pullRequestsReviewed}</p>
              <p className="text-sm text-muted-foreground">PRs Reviewed</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Code className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{STATS.connectedRepos}</p>
              <p className="text-sm text-muted-foreground">Repos Connected</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{STATS.aiReviewsGenerated}</p>
              <p className="text-sm text-muted-foreground">AI Reviews</p>
            </CardContent>
          </Card>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">{STATS.successRate}</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contribution Graph */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Contribution Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="flex gap-1 min-w-max">
                  {contributionData.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {week.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`w-3 h-3 rounded-sm ${getContributionColor(day)}`}
                          title={`${day} contributions`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getContributionColor(level)}`}
                  />
                ))}
                <span>More</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="repos">Connected Repos</TabsTrigger>
            </TabsList>

            <TabsContent value="activity">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <GitPullRequest className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{activity.action}</span>
                            {' '}{activity.target}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.repo}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className={`p-3 rounded-xl bg-background/50`}>
                          <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{achievement.name}</p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="repos">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REPOSITORIES.slice(0, 4).map((repo, index) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{repo.name}</p>
                            <p className="text-sm text-muted-foreground">{repo.language}</p>
                          </div>
                          <Badge variant="outline" className={
                            repo.status === 'Active' ? 'text-green-400 border-green-400/30' :
                            repo.status === 'Review' ? 'text-yellow-400 border-yellow-400/30' :
                            'text-muted-foreground'
                          }>
                            {repo.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {repo.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitPullRequest className="h-4 w-4" />
                            {repo.prs} open
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
