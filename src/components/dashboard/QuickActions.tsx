import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, GitPullRequest, Settings, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const actions = [
  {
    title: 'Connect Repository',
    description: 'Add a new GitHub repository',
    icon: Plus,
    href: '/repositories',
    variant: 'default' as const,
  },
  {
    title: 'View Reviews',
    description: 'Check pending AI reviews',
    icon: GitPullRequest,
    href: '/reviews',
    variant: 'secondary' as const,
  },
  {
    title: 'AI Settings',
    description: 'Configure review preferences',
    icon: Sparkles,
    href: '/settings',
    variant: 'secondary' as const,
  },
];

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={action.href}>
              <Button
                variant={action.variant}
                className="w-full justify-start h-auto py-3 px-4"
              >
                <action.icon className="h-4 w-4 mr-3 shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
