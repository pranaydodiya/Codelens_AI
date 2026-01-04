import { useState } from 'react';
import { motion } from 'framer-motion';
import { Puzzle, Check, ExternalLink, Settings, Webhook, Plus, Brain } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { GitHubConnect } from '@/components/integrations/GitHubConnect';
import { AIReviewService } from '@/components/ai/AIReviewService';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'available' | 'coming_soon';
  category: 'communication' | 'project' | 'development';
}

const integrations: Integration[] = [
  { id: 'github', name: 'GitHub', description: 'Connect repositories and sync pull requests automatically', icon: '🐙', status: 'connected', category: 'development' },
  { id: 'slack', name: 'Slack', description: 'Get notifications and AI review summaries in your channels', icon: '💬', status: 'available', category: 'communication' },
  { id: 'discord', name: 'Discord', description: 'Send review updates to your Discord server', icon: '🎮', status: 'available', category: 'communication' },
  { id: 'jira', name: 'Jira', description: 'Link PRs to Jira tickets and track progress', icon: '📋', status: 'available', category: 'project' },
  { id: 'linear', name: 'Linear', description: 'Sync issues and link to code changes', icon: '🔷', status: 'available', category: 'project' },
  { id: 'vscode', name: 'VS Code', description: 'Get AI suggestions directly in your editor', icon: '💻', status: 'coming_soon', category: 'development' },
  { id: 'gitlab', name: 'GitLab', description: 'Connect GitLab repositories for AI reviews', icon: '🦊', status: 'coming_soon', category: 'development' },
  { id: 'bitbucket', name: 'Bitbucket', description: 'Integrate with Atlassian Bitbucket repos', icon: '🪣', status: 'coming_soon', category: 'development' },
];

const webhooks = [
  { id: '1', name: 'Review Complete', url: 'https://api.example.com/webhook/review', status: 'active' },
  { id: '2', name: 'Critical Issues', url: 'https://hooks.slack.com/services/...', status: 'active' },
];

export default function Integrations() {
  const [configModal, setConfigModal] = useState<Integration | null>(null);
  const [webhookModal, setWebhookModal] = useState(false);
  const [githubModal, setGithubModal] = useState(false);
  const [activeTab, setActiveTab] = useState('integrations');

  const handleConnect = (integration: Integration) => {
    if (integration.status === 'coming_soon') {
      toast({ title: 'Coming Soon', description: `${integration.name} integration will be available soon!` });
      return;
    }
    if (integration.id === 'github') {
      setGithubModal(true);
      return;
    }
    setConfigModal(integration);
  };

  const handleSaveConfig = () => {
    toast({ title: 'Integration Updated', description: `${configModal?.name} settings saved successfully.` });
    setConfigModal(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Puzzle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Integrations & AI</h1>
              <p className="text-sm text-muted-foreground">Connect tools and access AI services</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Puzzle className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="ai-review" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Code Review
            </TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            {/* Integration Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {integrations.map((integration, i) => (
            <motion.div
              key={integration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className={cn(
                'h-full transition-all hover:shadow-md',
                integration.status === 'connected' && 'border-primary/30 bg-primary/5'
              )}>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-4xl">{integration.icon}</div>
                    <Badge variant={
                      integration.status === 'connected' ? 'default' :
                      integration.status === 'available' ? 'secondary' : 'outline'
                    } className={cn(
                      integration.status === 'connected' && 'bg-chart-2 hover:bg-chart-2',
                      integration.status === 'coming_soon' && 'text-muted-foreground'
                    )}>
                      {integration.status === 'connected' && <Check className="h-3 w-3 mr-1" />}
                      {integration.status === 'connected' ? 'Connected' :
                       integration.status === 'available' ? 'Available' : 'Coming Soon'}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{integration.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{integration.description}</p>
                  </div>
                  <Button
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                    size="sm"
                    className="w-full"
                    disabled={integration.status === 'coming_soon'}
                    onClick={() => handleConnect(integration)}
                  >
                    {integration.status === 'connected' ? (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </>
                    ) : integration.status === 'available' ? (
                      <>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    ) : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

            {/* Webhooks Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-primary" />
                    Webhooks
                  </CardTitle>
                  <CardDescription>Receive real-time notifications via custom webhooks</CardDescription>
                </div>
                <Button size="sm" onClick={() => setWebhookModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Webhook
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                      <div>
                        <p className="font-medium text-foreground">{webhook.name}</p>
                        <p className="text-sm text-muted-foreground font-mono">{webhook.url}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-chart-2 border-chart-2">Active</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-review">
            <AIReviewService />
          </TabsContent>
        </Tabs>
      </div>

      {/* GitHub Connect Modal */}
      <GitHubConnect isOpen={githubModal} onClose={() => setGithubModal(false)} />

      {/* Config Modal */}
      <Dialog open={!!configModal} onOpenChange={() => setConfigModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{configModal?.icon}</span>
              {configModal?.name} Configuration
            </DialogTitle>
            <DialogDescription>Configure your {configModal?.name} integration settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Enter your API key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channel">Default Channel</Label>
              <Input id="channel" placeholder="#general" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfigModal(null)}>Cancel</Button>
            <Button onClick={handleSaveConfig}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webhook Modal */}
      <Dialog open={webhookModal} onOpenChange={setWebhookModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Webhook</DialogTitle>
            <DialogDescription>Create a new webhook endpoint for notifications</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input id="webhook-name" placeholder="e.g., Production Alerts" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input id="webhook-url" placeholder="https://your-endpoint.com/webhook" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookModal(false)}>Cancel</Button>
            <Button onClick={() => { setWebhookModal(false); toast({ title: 'Webhook Created' }); }}>Create Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
