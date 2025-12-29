import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  GitPullRequest, 
  GitBranch, 
  Clock, 
  User, 
  FileCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PULL_REQUESTS, AI_REVIEW, CODE_FILES, SAMPLE_CODE } from '@/lib/constants';

const PRDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const pr = PULL_REQUESTS.find(p => p.id === id) || PULL_REQUESTS[0];
  
  const statusColors = {
    'Approved': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Changes Requested': 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  const aiComments = [
    { line: 8, type: 'warning', message: 'Consider using useCallback for the login function to prevent unnecessary re-renders.' },
    { line: 15, type: 'error', message: 'Token storage in localStorage is vulnerable to XSS attacks. Consider using httpOnly cookies.' },
    { line: 23, type: 'suggestion', message: 'Add error boundary to handle authentication failures gracefully.' },
  ];

  const timeline = [
    { time: '2 hours ago', event: 'AI Review completed', user: 'CodeWhisper AI', type: 'ai' },
    { time: '2 hours ago', event: 'Pull request created', user: pr.author, type: 'create' },
    { time: '1 hour ago', event: 'Added comment on line 15', user: 'Sarah Chen', type: 'comment' },
    { time: '30 mins ago', event: 'Pushed 2 commits', user: pr.author, type: 'commit' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <BackButton to="/reviews" label="Back to Reviews" />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* PR Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <GitPullRequest className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{pr.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {pr.author}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {pr.createdAt}
                </span>
                <span className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  feature/auth → main
                </span>
              </div>
            </div>
            <Badge className={statusColors[pr.status as keyof typeof statusColors]}>
              {pr.status}
            </Badge>
          </div>

          {/* Stats Row */}
          <div className="flex gap-4">
            <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <FileCode className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pr.files}</p>
                  <p className="text-sm text-muted-foreground">Files Changed</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">+{pr.additions}</p>
                  <p className="text-sm text-muted-foreground">Additions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-400">-{pr.deletions}</p>
                  <p className="text-sm text-muted-foreground">Deletions</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1 bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{AI_REVIEW.issues.length}</p>
                  <p className="text-sm text-muted-foreground">AI Comments</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code & Files */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <Tabs defaultValue="files">
                <CardHeader className="pb-0">
                  <TabsList className="bg-muted/50">
                    <TabsTrigger value="files">Files Changed</TabsTrigger>
                    <TabsTrigger value="diff">Code Diff</TabsTrigger>
                    <TabsTrigger value="comments">AI Comments</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-4">
                  <TabsContent value="files" className="mt-0">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {CODE_FILES.map((file, index) => (
                          <motion.div
                            key={file.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileCode className="h-4 w-4 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.path}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {file.language}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{file.changes}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="diff" className="mt-0">
                    <ScrollArea className="h-[400px]">
                      <pre className="text-sm font-mono p-4 rounded-lg bg-muted/30 overflow-x-auto">
                        {SAMPLE_CODE.split('\n').map((line, index) => (
                          <div 
                            key={index} 
                            className={`flex ${
                              line.startsWith('+') ? 'bg-green-500/10 text-green-400' :
                              line.startsWith('-') ? 'bg-red-500/10 text-red-400' :
                              'text-muted-foreground'
                            }`}
                          >
                            <span className="w-12 text-right pr-4 text-muted-foreground/50 select-none">
                              {index + 1}
                            </span>
                            <span>{line}</span>
                          </div>
                        ))}
                      </pre>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="comments" className="mt-0">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {aiComments.map((comment, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${
                              comment.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                              comment.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                              'bg-blue-500/10 border-blue-500/30'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {comment.type === 'error' ? (
                                <XCircle className="h-5 w-5 text-red-400 mt-0.5" />
                              ) : comment.type === 'warning' ? (
                                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
                              ) : (
                                <MessageSquare className="h-5 w-5 text-blue-400 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    Line {comment.line}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">CodeWhisper AI</span>
                                </div>
                                <p className="text-sm text-foreground">{comment.message}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* AI Score */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">AI Review Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted/20"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(pr.aiScore / 100) * 352} 352`}
                        className="text-primary"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-foreground">{pr.aiScore}</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  {AI_REVIEW.confidence}% AI Confidence
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Review Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2" variant="default">
                  <ThumbsUp className="h-4 w-4" />
                  Approve
                </Button>
                <Button className="w-full gap-2" variant="outline">
                  <ThumbsDown className="h-4 w-4" />
                  Request Changes
                </Button>
                <Button className="w-full gap-2" variant="ghost">
                  <MessageSquare className="h-4 w-4" />
                  Add Comment
                </Button>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`} />
                          <AvatarFallback>{item.user[0]}</AvatarFallback>
                        </Avatar>
                        {index < timeline.length - 1 && (
                          <div className="w-px h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-sm text-foreground">{item.event}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PRDetail;
