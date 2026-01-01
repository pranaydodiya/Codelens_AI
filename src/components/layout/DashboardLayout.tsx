import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { AnimatedBackground } from '@/components/ui/animated-background';
import { SidebarProvider, useSidebarContext } from '@/contexts/SidebarContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

function DashboardContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebarContext();

  return (
    <div className="min-h-screen bg-background relative isolate">
      <AnimatedBackground />
      
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block relative z-20">
        <Sidebar />
      </div>

      {/* Main Content - Responsive to sidebar state */}
      <div 
        className="transition-all duration-200 relative z-10 bg-background/80 backdrop-blur-sm"
        style={{ paddingLeft: isCollapsed ? '72px' : '256px' }}
      >
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 md:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
