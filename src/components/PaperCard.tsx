import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Paper } from '../types/paper';

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);
  const thumbRef = useRef<HTMLDivElement>(null);
  const imgLayoutId = `paper-img-${paper.id}`;

  const venueColor = {
    conference: '#3D78F5',
    journal: '#10B981',
    workshop: '#F59E0B',
  }[paper.venue.type] || '#3D78F5';

  // Zoom lens — direct DOM manipulation for zero React re-renders
  const handleEnter = useCallback(() => {
    const img = thumbRef.current?.querySelector('.zoom-img') as HTMLElement | null;
    if (img) img.style.transform = 'scale(2.5)';
  }, []);

  const handleLeave = useCallback(() => {
    const img = thumbRef.current?.querySelector('.zoom-img') as HTMLElement | null;
    if (img) {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = 'center center';
    }
  }, []);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = thumbRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const img = el.querySelector('.zoom-img') as HTMLElement | null;
    if (img) img.style.transformOrigin = `${x}% ${y}%`;
  }, []);

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
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="flex gap-5 p-4 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[var(--bg-alt)] border border-transparent hover:border-[var(--border-color)]"
        onClick={handleClick}
      >
        {/* Thumbnail — 2:1 ratio (w-56 h-28 = 224x112) */}
        {paper.image && (
          <div
            ref={thumbRef}
            className="hidden sm:block flex-shrink-0 w-56 h-28 rounded-lg overflow-hidden bg-[var(--bg-alt)] ring-1 ring-[var(--border-color)] group-hover:ring-accent/30 transition-all duration-300 relative"
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
                <svg className="w-5 h-5 text-white/70 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            )}

            {/* Sharp image — layoutId wrapper flies to expanded position */}
            {!expanded && (
              <motion.div
                layoutId={imgLayoutId}
                className="absolute inset-0 rounded-lg overflow-hidden"
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
          <h3 className="font-heading font-semibold text-[15px] leading-snug mb-1.5 group-hover:text-accent transition-colors">
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
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold text-white"
              style={{ backgroundColor: venueColor }}
            >
              {paper.venue.short} '{String(paper.year).slice(-2)}
            </span>
            {paper.award && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                {'\u{1F3C6}'} {paper.award}
              </span>
            )}
            {paper.status === 'under-review' && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                Under Review
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
        <div className="hidden sm:flex items-center">
          <motion.svg
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-4 h-4 text-faint"
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 space-y-3">
              {/* Image + Abstract side by side */}
              <div className="flex gap-4">
                {/* Expanded image — layoutId shared transition */}
                {paper.image && (
                  <motion.div
                    layoutId={imgLayoutId}
                    className="flex-shrink-0 rounded-xl overflow-hidden bg-[var(--bg-alt)] ring-1 ring-[var(--border-color)]"
                    style={{ width: '55%', aspectRatio: '2/1' }}
                    transition={layoutTransition}
                  >
                    <img
                      src={paper.image}
                      alt={paper.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Abstract — absolute-positioned so image alone determines row height */}
                {paper.abstract && (
                  <motion.div
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.25 }}
                    className="flex-1 min-w-0 relative"
                  >
                    <div className="absolute inset-0 overflow-y-auto pr-1 text-sm text-muted leading-relaxed scrollbar-thin">
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
                    <a href={paper.pdf} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                      {'\u{1F4C4}'} PDF
                    </a>
                  )}
                  {paper.doi && (
                    <a href={paper.doi} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                      {'\u{1F517}'} DOI
                    </a>
                  )}
                  {paper.video && (
                    <a href={paper.video} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                      {'\u{1F3AC}'} Video
                    </a>
                  )}
                </div>
                {paper.tags && paper.tags.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap">
                    {paper.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-alt)] text-faint">{tag}</span>
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
