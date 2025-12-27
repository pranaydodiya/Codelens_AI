import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatusBadge, ScoreBadge } from '@/components/ui/ai-badge';
import { Button } from '@/components/ui/button';

interface PullRequest {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  status: 'reviewed' | 'pending' | 'failed';
  aiScore: number | null;
  createdAt: string;
  files: number;
  additions: number;
  deletions: number;
}

interface RecentPRsTableProps {
  pullRequests: PullRequest[];
}

export function RecentPRsTable({ pullRequests }: RecentPRsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Recent Pull Requests</CardTitle>
          <CardDescription>Latest PRs analyzed by AI</CardDescription>
        </div>
        <Link to="/reviews">
          <Button variant="ghost" size="sm">
            View all
            <ExternalLink className="ml-2 h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pull Request</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Score</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pullRequests.map((pr, index) => (
                <motion.tr
                  key={pr.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <Link to="/reviews" className="block">
                      <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {pr.title}
                      </div>
                      <div className="text-xs text-muted-foreground">{pr.id}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-secondary">
                          {pr.authorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{pr.author}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={pr.status} />
                  </TableCell>
                  <TableCell>
                    <ScoreBadge score={pr.aiScore} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-success">+{pr.additions}</span>
                      <span className="text-destructive">-{pr.deletions}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {pr.createdAt}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
