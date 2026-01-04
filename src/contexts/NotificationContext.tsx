import { createContext, useContext, ReactNode } from 'react';
import { useRealtimeNotifications, RealtimeNotification } from '@/hooks/useRealtimeNotifications';

interface NotificationContextType {
  notifications: RealtimeNotification[];
  unreadCount: number;
  isConnected: boolean;
  addNotification: (notification: RealtimeNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationState = useRealtimeNotifications({
    enabled: false,
    intervalMin: 20000,
    intervalMax: 60000,
    showToasts: false,
  });

  return (
    <NotificationContext.Provider value={notificationState}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}