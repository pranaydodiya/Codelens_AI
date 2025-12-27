import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="md:pl-[72px] lg:pl-64 transition-all duration-200">
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
