import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  GitBranch,
  Code,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CreditCard,
  Wand2,
  Globe,
  Users,
  User,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebarContext } from '@/contexts/SidebarContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', path: '/repositories', icon: GitBranch },
  { name: 'Code Review', path: '/reviews', icon: Code },
  { name: 'History', path: '/history', icon: History },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Team', path: '/team', icon: Users },
];

const aiNavItems = [
  { name: 'AI Summary', path: '/ai-summary', icon: Sparkles },
  { name: 'Code Generator', path: '/ai-generator', icon: Wand2 },
  { name: 'API Playground', path: '/api-playground', icon: Globe },
];

const bottomNavItems = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Billing', path: '/billing', icon: CreditCard },
  { name: 'Integrations', path: '/integrations', icon: Globe },
  { name: 'Help', path: '/help', icon: HelpCircle },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebarContext();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 72 : 256 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar flex flex-col"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="font-semibold text-sidebar-foreground overflow-hidden whitespace-nowrap"
              >
                CodeLens
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors relative',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
        
        {/* AI Features Section */}
        {!isCollapsed && (
          <div className="pt-4 pb-2">
            <span className="px-3 text-[10px] uppercase tracking-wider text-sidebar-foreground/50 font-semibold">
              AI Features
            </span>
          </div>
        )}
        {isCollapsed && <div className="h-4" />}
        
        {aiNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors relative',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavAI"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="h-5 w-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-sidebar-border">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium overflow-hidden whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
