import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface RealtimeNotification {
  id: string;
  type: 'review' | 'mention' | 'system' | 'ai';
  title: string;
  description: string;
  time: string;
  read: boolean;
  timestamp: number;
}

const NOTIFICATION_TEMPLATES = [
  { type: 'review' as const, title: 'New AI Review Ready', descriptions: [
    'AI completed review for PR #${pr} in frontend-app',
    'Code analysis finished for your latest commit',
    'Security vulnerabilities detected in PR #${pr}',
  ]},
  { type: 'mention' as const, title: 'New Mention', descriptions: [
    'Sarah mentioned you in a code review',
    'Mike tagged you in PR #${pr}',
    'Your input is requested on a design decision',
  ]},
  { type: 'ai' as const, title: 'AI Insight', descriptions: [
    'AI detected a potential optimization opportunity',
    'Code quality score improved by 15%',
    'New refactoring suggestions available',
  ]},
  { type: 'system' as const, title: 'System Update', descriptions: [
    'Your weekly code quality report is ready',
    'New integration available: VS Code Extension',
    'Repository sync completed successfully',
  ]},
];

function generateNotification(): RealtimeNotification {
  const template = NOTIFICATION_TEMPLATES[Math.floor(Math.random() * NOTIFICATION_TEMPLATES.length)];
  const description = template.descriptions[Math.floor(Math.random() * template.descriptions.length)];
  const prNumber = Math.floor(Math.random() * 200) + 100;

  return {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: template.type,
    title: template.title,
    // Single template variable substitution - using replace() is intentional
    description: description.replace('${pr}', prNumber.toString()),
    time: 'Just now',
    read: false,
    timestamp: Date.now(),
  };
}

interface UseRealtimeNotificationsOptions {
  enabled?: boolean;
  intervalMin?: number;
  intervalMax?: number;
  maxNotifications?: number;
  showToasts?: boolean;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const {
    enabled = true,
    intervalMin = 15000,
    intervalMax = 45000,
    maxNotifications = 50,
    showToasts = true,
  } = options;

  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback((notification: RealtimeNotification) => {
    setNotifications((prev) => {
      const updated = [notification, ...prev].slice(0, maxNotifications);
      return updated;
    });

    if (showToasts) {
      const icons = {
        review: '🔍',
        mention: '💬',
        system: '⚙️',
        ai: '🤖',
      };
      
      toast(notification.title, {
        description: notification.description,
        icon: icons[notification.type],
        action: {
          label: 'View',
          onClick: () => {
            markAsRead(notification.id);
          },
        },
      });
    }
  }, [maxNotifications, showToasts]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!enabled) return;

    setIsConnected(true);

    const scheduleNextNotification = () => {
      const interval = intervalMin + Math.random() * (intervalMax - intervalMin);
      return setTimeout(() => {
        const newNotification = generateNotification();
        addNotification(newNotification);
        timeoutId = scheduleNextNotification();
      }, interval);
    };

    let timeoutId = scheduleNextNotification();

    return () => {
      clearTimeout(timeoutId);
      setIsConnected(false);
    };
  }, [enabled, intervalMin, intervalMax, addNotification]);

  return {
    notifications,
    unreadCount,
    isConnected,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}