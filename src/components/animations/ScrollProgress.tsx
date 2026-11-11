"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return <motion.div aria-hidden style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-neon via-cyan to-violet" />;
}
