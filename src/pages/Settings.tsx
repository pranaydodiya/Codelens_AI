import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Shield,
  GitBranch,
  Sparkles,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reviews: true,
    marketing: false,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto p-1">
              <TabsTrigger value="profile" className="gap-2 py-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2 py-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2 py-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="integrations" className="gap-2 py-2">
                <GitBranch className="h-4 w-4" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2 py-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        Change Photo
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue="Doe" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john@acme.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" defaultValue="Acme Corporation" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how CodeLens looks on your device
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'system', icon: Monitor, label: 'System' },
                      ].map((option) => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setTheme(option.value as any)}
                          className={cn(
                            'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors',
                            theme === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-muted-foreground/50'
                          )}
                        >
                          <option.icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        key: 'email',
                        label: 'Email Notifications',
                        description: 'Receive email updates about your reviews',
                      },
                      {
                        key: 'push',
                        label: 'Push Notifications',
                        description: 'Receive push notifications in your browser',
                      },
                      {
                        key: 'reviews',
                        label: 'Review Completed',
                        description: 'Get notified when AI completes a review',
                      },
                      {
                        key: 'marketing',
                        label: 'Marketing Emails',
                        description: 'Receive updates about new features and tips',
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.description}
                          </div>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Manage your connected services and integrations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'GitHub', connected: true, icon: '🐙' },
                    { name: 'GitLab', connected: false, icon: '🦊' },
                    { name: 'Bitbucket', connected: false, icon: '🪣' },
                    { name: 'Slack', connected: true, icon: '💬' },
                  ].map((integration) => (
                    <motion.div
                      key={integration.name}
                      whileHover={{ x: 2 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <div className="font-medium">{integration.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {integration.connected ? 'Connected' : 'Not connected'}
                          </div>
                        </div>
                      </div>
                      <Button variant={integration.connected ? 'outline' : 'default'} size="sm">
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* AI Settings Tab */}
            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle>AI Review Settings</CardTitle>
                  <CardDescription>
                    Configure how the AI analyzes your code
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        label: 'Security Analysis',
                        description: 'Detect potential security vulnerabilities',
                        enabled: true,
                      },
                      {
                        label: 'Performance Suggestions',
                        description: 'Identify performance optimization opportunities',
                        enabled: true,
                      },
                      {
                        label: 'Style Enforcement',
                        description: 'Check for code style consistency',
                        enabled: true,
                      },
                      {
                        label: 'Creative Output',
                        description: 'Include AI-generated poems and analogies',
                        enabled: false,
                      },
                    ].map((setting) => (
                      <div
                        key={setting.label}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div>
                          <div className="font-medium">{setting.label}</div>
                          <div className="text-sm text-muted-foreground">
                            {setting.description}
                          </div>
                        </div>
                        <Switch defaultChecked={setting.enabled} />
                      </div>
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
}
