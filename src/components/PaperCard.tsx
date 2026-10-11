import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { Paper } from '../types/paper';

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const thumbRef = useRef<HTMLDivElement>(null);
  const imgLayoutId = `paper-img-${paper.id}`;
  const detailsId = `paper-details-${paper.id}`;

  // Zoom lens — direct DOM manipulation for zero React re-renders
  const handleEnter = useCallback(() => {
    if (reduceMotion) return;
    const img = thumbRef.current?.querySelector('.zoom-img') as HTMLElement | null;
    if (img) img.style.transform = 'scale(1.9)';
  }, [reduceMotion]);

  const handleLeave = useCallback(() => {
    const img = thumbRef.current?.querySelector('.zoom-img') as HTMLElement | null;
    if (img) {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
    }
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (reduceMotion) return;
    const el = thumbRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const img = el.querySelector('.zoom-img') as HTMLElement | null;
    if (img) img.style.transformOrigin = `${x}% ${y}%`;
  }, [reduceMotion]);

  const handleClick = useCallback(() => {
    // Reset zoom instantly before layout animation captures snapshot
    if (!expanded && thumbRef.current) {
      const img = thumbRef.current.querySelector('.zoom-img') as HTMLElement | null;
      if (img) {
        img.style.transition = 'none';
        img.style.transform = 'scale(1)';
        img.style.transformOrigin = 'center center';
        void img.offsetHeight; // force reflow so FM captures un-zoomed state
        img.style.transition = '';
      }
    }
    setExpanded(prev => !prev);
  }, [expanded]);

  const layoutTransition = {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -2 }}
        whileTap={reduceMotion ? undefined : { scale: 0.995 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        className="relative flex touch-manipulation gap-3 p-4 cursor-pointer transition-colors duration-200 border border-transparent hover:border-[var(--text-tertiary)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--text-secondary)] sm:gap-5"
        onClick={handleClick}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleClick();
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={detailsId}
        data-cursor="pointer"
      >
        <span className="pointer-events-none absolute left-0 top-1/2 h-0 w-px bg-[var(--text-secondary)] transition-all duration-300 group-hover:top-2 group-hover:h-[calc(100%-1rem)]" />
        {/* Thumbnail — 2:1 ratio (w-56 h-28 = 224x112) */}
        {paper.image && (
          <div
            ref={thumbRef}
            className="hidden sm:block flex-shrink-0 w-56 h-28 overflow-hidden bg-[var(--bg-alt)] border border-subtle group-hover:border-[var(--text-tertiary)] transition-colors duration-300 relative"
            onMouseEnter={expanded ? undefined : handleEnter}
            onMouseLeave={expanded ? undefined : handleLeave}
            onMouseMove={expanded ? undefined : handleMove}
          >
            {/* Blurred placeholder — revealed when sharp image flies away */}
            <img
              src={paper.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-[6px] scale-110 brightness-90 transition-opacity duration-500"
              style={{ opacity: expanded ? 1 : 0 }}
              aria-hidden="true"
            />
            {expanded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            )}

            {/* Sharp image — layoutId wrapper flies to expanded position */}
            {!expanded && (
              <motion.div
                layoutId={imgLayoutId}
                className="absolute inset-0 overflow-hidden"
                transition={layoutTransition}
              >
                <img
                  src={paper.image}
                  alt={paper.title}
                  className="zoom-img w-full h-full object-cover will-change-transform"
                  style={{
                    transition: 'transform 0.2s ease-out',
                    transform: 'scale(1)',
                    transformOrigin: 'center center',
                  }}
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="relative mb-1.5 font-heading text-[15px] font-semibold leading-snug transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[var(--text-secondary)] after:transition-transform after:duration-300 group-hover:after:scale-x-100">
            {paper.title}
          </h3>
          <p className="text-sm text-muted mb-2 leading-relaxed">
            {paper.authors.map((author, i) => (
              <span key={i}>
                {author.me ? (
                  <span className="font-semibold text-accent">{author.name}</span>
                ) : (
                  <span>{author.name}</span>
                )}
                {author.role === 'corresponding' && <span className="text-faint">*</span>}
                {i < paper.authors.length - 1 && ', '}
              </span>
            ))}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-flex items-center text-xs font-medium uppercase tracking-wide text-muted"
            >
              {paper.venue.short} '{String(paper.year).slice(-2)}
            </span>
            {paper.award && (
              <span className="inline-flex items-center text-xs font-medium text-muted">
                {'\u{1F3C6}'} {paper.award}
              </span>
            )}
            {!expanded && (
              <span className="text-xs text-faint hidden lg:inline truncate max-w-md">
                — {paper.venue.full}
              </span>
            )}
          </div>
        </div>

        {/* Expand indicator */}
        <div className="flex min-h-11 w-6 flex-shrink-0 items-center justify-center self-center sm:min-h-0 sm:w-auto">
          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 text-faint"
            aria-hidden="true"
            focusable="false"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            id={detailsId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-3">
              {/* Mobile stacks the image above the abstract; sm+ remains side by side. */}
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                {/* Expanded image — layoutId shared transition */}
                {paper.image && (
                  <motion.div
                    layoutId={imgLayoutId}
                    className="aspect-[2/1] w-full overflow-hidden bg-[var(--bg-alt)] border border-subtle sm:w-[55%] sm:flex-shrink-0"
                    transition={layoutTransition}
                  >
                    <img
                      src={paper.image}
                      alt={paper.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Abstract flows normally on mobile; sm+ uses the image-defined row height. */}
                {paper.abstract && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.25 }}
                    className="w-full min-w-0 sm:relative sm:flex-1"
                  >
                    <div className="text-sm text-muted leading-relaxed sm:absolute sm:inset-0 sm:overflow-y-auto sm:pr-1 sm:scrollbar-thin">
                      <p>{paper.abstract}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Links & tags row */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="flex items-center gap-3 flex-wrap"
              >
                <p className="text-xs text-faint">
                  {paper.venue.full}, {paper.year}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {paper.pdf && (
                    <a href={paper.pdf} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-1.5 px-3 py-1.5 border border-subtle text-xs font-medium text-muted hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:min-h-0">
                      {'\u{1F4C4}'} PDF
                    </a>
                  )}
                  {paper.doi && (
                    <a href={paper.doi} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-1.5 px-3 py-1.5 border border-subtle text-xs font-medium text-muted hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:min-h-0">
                      {'\u{1F517}'} DOI
                    </a>
                  )}
                  {paper.video && (
                    <a href={paper.video} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex min-h-11 touch-manipulation items-center justify-center gap-1.5 px-3 py-1.5 border border-subtle text-xs font-medium text-muted hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:min-h-0">
                      {'\u{1F3AC}'} Video
                    </a>
                  )}
                </div>
                {paper.tags && paper.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {paper.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 border border-subtle text-faint">{tag}</span>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
