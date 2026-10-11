import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';

type CursorMode = 'default' | 'interactive' | 'drag';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [mode, setMode] = useState<CursorMode>('default');
  const modeRef = useRef<CursorMode>('default');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 420, damping: 34, mass: 0.35 });
  const ringY = useSpring(cursorY, { stiffness: 420, damping: 34, mass: 0.35 });

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncAvailability = () => {
      const shouldEnable = finePointer.matches && !reducedMotion.matches;
      setEnabled(shouldEnable);
      document.documentElement.classList.toggle('has-custom-cursor', shouldEnable);

      if (!shouldEnable) {
        setVisible(false);
        setPressed(false);
      }
    };

    syncAvailability();
    finePointer.addEventListener('change', syncAvailability);
    reducedMotion.addEventListener('change', syncAvailability);

    return () => {
      finePointer.removeEventListener('change', syncAvailability);
      reducedMotion.removeEventListener('change', syncAvailability);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const updateMode = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      const nextMode: CursorMode = element?.closest('[data-cursor="drag"]')
        ? 'drag'
        : element?.closest('a, button, [role="button"], [data-cursor="pointer"]')
          ? 'interactive'
          : 'default';

      if (modeRef.current !== nextMode) {
        modeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const handleMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      updateMode(event.target);
      setVisible(true);
    };
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => {
      setVisible(false);
      setPressed(false);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    window.addEventListener('pointercancel', handleUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [cursorX, cursorY, enabled]);

  if (!enabled) return null;

  const ringSize = mode === 'drag' ? 48 : mode === 'interactive' ? 34 : 20;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="relative rounded-full border border-[var(--text-secondary)]"
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? (mode === 'default' ? 0.52 : 0.82) : 0,
            scale: pressed ? 0.72 : 1,
          }}
          transition={{ type: 'spring', stiffness: 440, damping: 30, mass: 0.32 }}
        >
          <AnimatePresence>
            {mode === 'drag' && visible && (
              <motion.span
                className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap font-mono text-[7px] font-medium tracking-[0.18em] text-[var(--text-secondary)]"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 0.9, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                transition={{ duration: 0.14 }}
              >
                DRAG
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-[3px] rounded-full bg-[var(--text-primary)]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? 0.9 : 0,
          scale: pressed ? 0.55 : 1,
        }}
        transition={{ duration: 0.12 }}
      />

      <style>{`
        @media (pointer: fine) and (prefers-reduced-motion: no-preference) {
          html.has-custom-cursor,
          html.has-custom-cursor * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
