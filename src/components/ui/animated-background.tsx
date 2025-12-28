import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Floating code symbols and tech elements
const codeSymbols = ['<>', '/>', '{', '}', '()', '[]', '=>', '&&', '||', '++', '===', 'const', 'let', 'async', 'await', 'function', 'return', 'import', 'export', 'if', 'else'];
const techIcons = ['⚛️', '🔧', '⚡', '🔥', '💻', '🚀', '📦', '🔗', '⭐', '🛠️'];

interface FloatingElement {
  id: number;
  symbol: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

export function AnimatedBackground() {
  const elements: FloatingElement[] = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    symbol: i % 3 === 0 ? techIcons[i % techIcons.length] : codeSymbols[i % codeSymbols.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
    delay: Math.random() * 5,
    size: 10 + Math.random() * 14,
    opacity: 0.03 + Math.random() * 0.07,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Floating code symbols */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute font-mono text-primary select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            opacity: el.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 5, -5, 0],
            opacity: [el.opacity, el.opacity * 1.5, el.opacity],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {el.symbol}
        </motion.div>
      ))}
      
      {/* GitHub-style contribution graph pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-[0.03]">
        <div className="flex flex-wrap gap-1 p-4">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-sm bg-primary"
              initial={{ opacity: 0.1 }}
              animate={{ 
                opacity: [0.1, 0.3 + Math.random() * 0.5, 0.1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Animated circuit lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <motion.path
          d="M0,100 Q250,50 500,100 T1000,100"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M0,200 Q350,150 700,200 T1400,200"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.path
          d="M0,300 Q450,250 900,300 T1800,300"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, delay: 2, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      
      {/* Glowing orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        style={{ top: '10%', right: '10%' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-accent/10 blur-3xl"
        style={{ bottom: '20%', left: '5%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.03, 0.08, 0.03],
        }}
        transition={{ duration: 10, delay: 2, repeat: Infinity }}
      />
      
      {/* Binary rain effect */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden opacity-[0.02]">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-xs text-primary whitespace-nowrap"
            style={{ left: `${i * 7}%` }}
            initial={{ y: -100 }}
            animate={{ y: '100vh' }}
            transition={{
              duration: 10 + Math.random() * 10,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j}>{Math.random() > 0.5 ? '1' : '0'}</div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
