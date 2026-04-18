"use client";

import { motion } from "framer-motion";
export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl sm:text-6xl md:text-8xl tracking-tighter font-serif font-black z-1 max-w-5xl text-center text-shadow-lg "
      >
        Unlock Value in Every Conversation
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-lg max-w-2xl text-center mt-4 text-muted-foreground"
      >
        Engage Better. Sell More. Grow Faster - with Instagram Automation
      </motion.p>
    </div>
  );
}
