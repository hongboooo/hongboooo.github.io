import { motion, useReducedMotion } from 'framer-motion';

interface FilterBarProps {
  categories: { key: string; title: string; color: string }[];
  activeCategory: string;
  activeType: string;
  onCategoryChange: (cat: string) => void;
  onTypeChange: (type: string) => void;
  paperCounts: Record<string, number>;
  awardCount: number;
  firstAuthorCount: number;
}

const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'first-author', label: 'First Author' },
  { key: 'awarded', label: 'Awarded \u{1F3C6}' },
];

export default function FilterBar({
  categories,
  activeCategory,
  activeType,
  onCategoryChange,
  onTypeChange,
  paperCounts,
  awardCount,
  firstAuthorCount,
}: FilterBarProps) {
  const reduceMotion = useReducedMotion();
  const allCategories = [
    { key: 'all', title: 'All', color: '#63666b' },
    ...categories,
  ];

  return (
    <div className="space-y-3 mb-10">
      {/* Topic filter */}
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <span id="topic-filter-label" className="mr-1 text-xs font-medium text-faint uppercase tracking-wider">Topic</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0 sm:gap-2" role="group" aria-labelledby="topic-filter-label">
          {allCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            const count = cat.key === 'all'
              ? Object.values(paperCounts).reduce((a, b) => a + b, 0)
              : (paperCounts[cat.key] || 0);
            return (
              <motion.button
                key={cat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => onCategoryChange(cat.key)}
                whileTap={reduceMotion ? undefined : { y: 1 }}
                className="relative min-h-11 min-w-11 touch-manipulation px-1 py-1.5 text-left text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--text-tertiary)] after:transition-transform after:duration-200 hover:after:scale-x-100 sm:min-h-0 sm:min-w-0"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>
                  {cat.title}
                  <span className="ml-1 opacity-70">{count}</span>
                </span>
                {isActive && (
                  <motion.span
                    layoutId="category-indicator"
                    className="absolute inset-x-1 bottom-0 h-px bg-[var(--text-primary)]"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Type filter */}
      <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-2">
        <span id="type-filter-label" className="mr-1 text-xs font-medium text-faint uppercase tracking-wider">Type</span>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0 sm:gap-2" role="group" aria-labelledby="type-filter-label">
          {typeFilters.map((type) => {
            const isActive = activeType === type.key;
            let count = 0;
            if (type.key === 'all') count = Object.values(paperCounts).reduce((a, b) => a + b, 0);
            else if (type.key === 'awarded') count = awardCount;
            else if (type.key === 'first-author') count = firstAuthorCount;

            if (type.key !== 'all' && count === 0) return null;

            return (
              <motion.button
                key={type.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => onTypeChange(type.key)}
                whileTap={reduceMotion ? undefined : { y: 1 }}
                className="relative min-h-11 min-w-11 touch-manipulation px-1 py-1.5 text-left text-sm font-medium transition-colors duration-200 after:absolute after:inset-x-1 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--text-tertiary)] after:transition-transform after:duration-200 hover:after:scale-x-100 sm:min-h-0 sm:min-w-0"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                {type.label}
                <span className="ml-1 opacity-70">{count}</span>
                {isActive && (
                  <motion.span
                    layoutId="type-indicator"
                    className="absolute inset-x-1 bottom-0 h-px bg-[var(--text-primary)]"
                    transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
