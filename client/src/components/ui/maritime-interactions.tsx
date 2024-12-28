import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Waves, Anchor, Ship } from "lucide-react";

interface RippleProps {
  className?: string;
  center?: boolean;
}

export function WaterRipple({ className, center }: RippleProps) {
  return (
    <motion.div
      className={cn(
        "absolute pointer-events-none rounded-full border-2 border-brand-primary/20",
        center && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        className
      )}
      initial={{ width: 0, height: 0, opacity: 1 }}
      animate={{ 
        width: 100, 
        height: 100, 
        opacity: 0,
        borderWidth: "1px"
      }}
      transition={{ 
        duration: 1,
        ease: "easeOut"
      }}
    />
  );
}

export function HoverWave({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={cn("relative overflow-hidden group", className)}
      whileHover="hover"
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary/10"
        variants={{
          hover: {
            scaleX: [1, 1.2, 0.8, 1],
            transition: {
              repeat: Infinity,
              duration: 2
            }
          }
        }}
      />
    </motion.div>
  );
}

export function FloatingAnchor() {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
        rotate: [-5, 5, -5]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-brand-primary"
    >
      <Anchor className="h-6 w-6" />
    </motion.div>
  );
}

export function NavigatingShip() {
  return (
    <motion.div
      animate={{
        x: [-20, 20, -20],
        y: [-5, 5, -5],
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-brand-primary"
    >
      <Ship className="h-8 w-8" />
    </motion.div>
  );
}

export function WaveDivider() {
  return (
    <div className="relative h-12 overflow-hidden">
      <motion.div
        className="absolute inset-0 flex"
        animate={{
          x: [0, -100, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Waves 
            key={i}
            className="h-12 w-12 text-brand-primary/20" 
            strokeWidth={1}
          />
        ))}
      </motion.div>
    </div>
  );
}