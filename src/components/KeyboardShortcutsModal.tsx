import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const shortcuts = [
  { category: 'Navigation', items: [
    { keys: ['⌘', 'K'], action: 'Open command search' },
    { keys: ['G', 'then', 'D'], action: 'Go to Dashboard' },
    { keys: ['G', 'then', 'R'], action: 'Go to Repositories' },
    { keys: ['G', 'then', 'P'], action: 'Go to Pull Requests' },
    { keys: ['G', 'then', 'A'], action: 'Go to Analytics' },
  ]},
  { category: 'Actions', items: [
    { keys: ['⌘', 'Enter'], action: 'Submit form' },
    { keys: ['Esc'], action: 'Close modal / dialog' },
    { keys: ['?'], action: 'Show this help' },
  ]},
  { category: 'AI Features', items: [
    { keys: ['⌘', 'G'], action: 'Open AI Code Generator' },
    { keys: ['⌘', 'S'], action: 'Open AI Summary' },
    { keys: ['⌘', 'A'], action: 'Open API Playground' },
  ]},
];

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
          return;
        }
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
          >
            <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  <h2 className="font-semibold text-card-foreground">Keyboard Shortcuts</h2>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6">
                {shortcuts.map((section) => (
                  <div key={section.category}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      {section.category}
                    </h3>
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-secondary/50 transition-colors">
                          <span className="text-sm text-foreground">{item.action}</span>
                          <div className="flex items-center gap-1">
                            {item.keys.map((key, j) => (
                              key === 'then' ? (
                                <span key={j} className="text-xs text-muted-foreground mx-1">then</span>
                              ) : (
                                <kbd key={j} className="min-w-[28px] h-7 px-2 inline-flex items-center justify-center text-xs rounded-md bg-secondary border border-border font-mono shadow-sm">
                                  {key}
                                </kbd>
                              )
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-border bg-muted/30">
                <p className="text-xs text-center text-muted-foreground">
                  Press <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-secondary border border-border font-mono">?</kbd> to toggle this menu
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
