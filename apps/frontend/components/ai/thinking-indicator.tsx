"use client";

import { motion } from "framer-motion";

export default function ThinkingIndicator() {
  return (
    <div className="flex items-center justify-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
          }}
          className="w-4 h-4 rounded-full bg-primary"
        />
      ))}
    </div>
  );
}
