import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, GitPullRequest, MessageSquare, AlertCircle, Bot, CheckCheck, Wifi, WifiOff } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/contexts/NotificationContext';
import { useState } from 'react';

const typeIcons = {
  review: GitPullRequest,
  mention: MessageSquare,
  system: AlertCircle,
  ai: Bot,
};

const typeColors = {
  review: 'text-primary',
  mention: 'text-chart-2',
  system: 'text-chart-4',
  ai: 'text-chart-3',
};

export default function Notifications() {
  const { notifications, unreadCount, isConnected, markAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications();
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    return n.type === activeTab;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs',
                    isConnected ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {isConnected ? (
                    <>
                      <Wifi className="h-3 w-3" />
                      <span>Live</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      <span>Offline</span>
                    </>
                  )}
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll} disabled={notifications.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear all
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground text-xs h-5 px-1.5">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="review">Reviews</TabsTrigger>
            <TabsTrigger value="mention">Mentions</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredNotifications.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bell className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up! New notifications will appear here in real-time.</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredNotifications.map((notification, i) => {
                    const Icon = typeIcons[notification.type];
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.95 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <Card className={cn(
                          'transition-all duration-300',
                          !notification.read && 'bg-primary/5 border-primary/20 shadow-sm shadow-primary/5'
                        )}>
                          <CardContent className="flex items-start gap-4 p-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300 }}
                              className={cn('h-10 w-10 rounded-lg bg-secondary flex items-center justify-center shrink-0', typeColors[notification.type])}
                            >
                              <Icon className="h-5 w-5" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h4 className={cn('font-medium text-foreground', !notification.read && 'font-semibold')}>
                                    {notification.title}
                                    {!notification.read && (
                                      <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="inline-block ml-2 h-2 w-2 rounded-full bg-primary"
                                      />
                                    )}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mt-0.5">{notification.description}</p>
                                </div>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => markAsRead(notification.id)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteNotification(notification.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}