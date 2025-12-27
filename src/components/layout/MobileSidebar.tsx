import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  GitBranch,
  Code,
  History,
  BarChart3,
  Settings,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', path: '/repositories', icon: GitBranch },
  { name: 'Code Review', path: '/reviews', icon: Code },
  { name: 'History', path: '/history', icon: History },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Billing', path: '/billing', icon: CreditCard },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function MobileSidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center px-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">CodeLens</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={item.path}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-primary'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}
