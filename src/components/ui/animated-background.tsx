import { motion } from 'framer-motion';

// AI-themed symbols and neural network elements
const aiSymbols = ['AI', 'ML', 'NN', 'GPU', 'API', 'LLM', '⚡', '🧠', '🔮', '✨'];
const codeSymbols = ['<>', '/>', '{', '}', '()', '[]', '=>', '&&', '||', '++', '===', 'const', 'let', 'async', 'await', 'function', 'return'];

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

interface NeuralNode {
  id: number;
  x: number;
  y: number;
  connections: number[];
}

export function AnimatedBackground() {
  // Floating elements
  const elements: FloatingElement[] = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    symbol: i % 4 === 0 ? aiSymbols[i % aiSymbols.length] : codeSymbols[i % codeSymbols.length],
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 12 + Math.random() * 18,
    delay: Math.random() * 5,
    size: 10 + Math.random() * 16,
    opacity: 0.02 + Math.random() * 0.06,
  }));

  // Neural network nodes for AI effect
  const neuralNodes: NeuralNode[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + (i % 4) * 30 + Math.random() * 10,
    y: 20 + Math.floor(i / 4) * 30 + Math.random() * 10,
    connections: [Math.min(i + 1, 11), Math.min(i + 4, 11), Math.max(i - 1, 0)],
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 80% 60%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 50% 30%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--primary) / 0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Grid pattern with pulse */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        animate={{ opacity: [0.02, 0.04, 0.02] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Neural network visualization */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
        {/* Neural connections */}
        {neuralNodes.map((node) =>
          node.connections.map((targetId) => {
            const target = neuralNodes[targetId];
            return (
              <motion.line
                key={`${node.id}-${targetId}`}
                x1={`${node.x}%`}
                y1={`${node.y}%`}
                x2={`${target.x}%`}
                y2={`${target.y}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1, 0],
                  opacity: [0, 0.5, 0.5, 0],
                }}
                transition={{
                  duration: 3,
                  delay: node.id * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            );
          })
        )}
        {/* Neural nodes */}
        {neuralNodes.map((node) => (
          <motion.circle
            key={node.id}
            cx={`${node.x}%`}
            cy={`${node.y}%`}
            r="4"
            fill="hsl(var(--primary))"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1.2, 1],
              opacity: [0, 0.8, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              delay: node.id * 0.15,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </svg>

      {/* Floating AI symbols with glow effect */}
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute font-mono text-primary select-none"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            fontSize: `${el.size}px`,
            opacity: el.opacity,
            textShadow: el.symbol.length <= 3 ? '0 0 10px hsl(var(--primary) / 0.5)' : 'none',
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            rotate: [0, 8, -8, 0],
            opacity: [el.opacity, el.opacity * 2, el.opacity],
            scale: [1, 1.1, 1],
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

      {/* AI Processing rings */}
      <div className="absolute top-1/4 right-1/4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            style={{
              width: `${100 + i * 60}px`,
              height: `${100 + i * 60}px`,
              left: `${-50 - i * 30}px`,
              top: `${-50 - i * 30}px`,
            }}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 20 + i * 5, repeat: Infinity, ease: 'linear' },
              scale: { duration: 3, repeat: Infinity },
            }}
          />
        ))}
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-primary/40"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* Data stream lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M${-50 + i * 100},${200 + i * 50} Q${250 + i * 100},${100 + i * 30} ${600 + i * 100},${250 + i * 40}`}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="10 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{
              duration: 4 + i,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </svg>

      {/* Contribution graph pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-28 opacity-[0.03]">
        <div className="flex flex-wrap gap-1 p-4">
          {Array.from({ length: 80 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-sm bg-primary"
              initial={{ opacity: 0.1 }}
              animate={{
                opacity: [0.1, 0.2 + Math.random() * 0.6, 0.1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 2,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      </div>

      {/* Glowing orbs with enhanced animation */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]"
        style={{ top: '5%', right: '5%' }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.04, 0.1, 0.04],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-accent/10 blur-[80px]"
        style={{ bottom: '10%', left: '0%' }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.02, 0.08, 0.02],
          x: [0, 30, 0],
        }}
        transition={{ duration: 15, delay: 3, repeat: Infinity }}
      />

      {/* AI Pulse effect at center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/10"
            style={{
              width: '200px',
              height: '200px',
              left: '-100px',
              top: '-100px',
            }}
            animate={{
              scale: [1, 3, 4],
              opacity: [0.3, 0.1, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 1.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Binary/hex rain effect */}
      <div className="absolute top-0 left-0 right-0 h-full overflow-hidden opacity-[0.015]">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-[10px] text-primary whitespace-nowrap"
            style={{ left: `${i * 5}%` }}
            initial={{ y: -200 }}
            animate={{ y: '110vh' }}
            transition={{
              duration: 8 + Math.random() * 8,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {Array.from({ length: 30 }).map((_, j) => (
              <div key={j} className="leading-tight">
                {Math.random() > 0.5 ? Math.random().toString(16).slice(2, 4).toUpperCase() : Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}