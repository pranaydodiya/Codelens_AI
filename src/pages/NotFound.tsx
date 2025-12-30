import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Home, LayoutDashboard, GitBranch, Search, Code, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const floatingElements = [
  { symbol: '</', delay: 0, x: -120, y: -80 },
  { symbol: '/>', delay: 0.2, x: 100, y: -60 },
  { symbol: '{ }', delay: 0.4, x: -80, y: 60 },
  { symbol: '( )', delay: 0.6, x: 120, y: 40 },
  { symbol: '[ ]', delay: 0.8, x: -140, y: 0 },
  { symbol: '&&', delay: 1, x: 80, y: -100 },
];

const quickLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Repositories', path: '/repositories', icon: GitBranch },
  { name: 'Code Review', path: '/reviews', icon: Code },
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 overflow-hidden">
      {/* Floating Code Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((el, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 0.2, 0.2, 0],
              y: [20, -20, -20, 20],
              x: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6,
              delay: el.delay,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="absolute top-1/2 left-1/2 text-4xl font-mono text-primary/20 font-bold"
            style={{ transform: `translate(${el.x}px, ${el.y}px)` }}
          >
            {el.symbol}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <h1 className="text-[120px] sm:text-[160px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/70 to-primary/40">
            404
          </h1>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Lost in the codebase?
          </h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative max-w-sm mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-0"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <p className="text-sm text-muted-foreground">Quick navigation</p>
          <div className="flex flex-wrap justify-center gap-3">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                <Link to={link.path}>
                  <Button variant="outline" className="gap-2">
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Button variant="ghost" onClick={() => window.history.back()} className="gap-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
