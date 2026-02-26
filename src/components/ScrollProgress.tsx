import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 h-[2px] z-40 origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #3D78F5, #8B5CF6)',
      }}
    />
  );
}
