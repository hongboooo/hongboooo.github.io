import { motion } from 'framer-motion';

interface FilterBarProps {
  categories: { key: string; title: string; color: string }[];
  activeCategory: string;
  activeType: string;
  onCategoryChange: (cat: string) => void;
  onTypeChange: (type: string) => void;
  paperCounts: Record<string, number>;
  awardCount: number;
  underReviewCount: number;
}

const typeFilters = [
  { key: 'all', label: 'All' },
  { key: 'awarded', label: 'Awarded \u{1F3C6}' },
  { key: 'under-review', label: 'In Progress' },
];

export default function FilterBar({
  categories,
  activeCategory,
  activeType,
  onCategoryChange,
  onTypeChange,
  paperCounts,
  awardCount,
  underReviewCount,
}: FilterBarProps) {
  const allCategories = [
    { key: 'all', title: 'All', color: '#3D78F5' },
    ...categories,
  ];

  return (
    <div className="space-y-3 mb-10">
      {/* Topic filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-faint uppercase tracking-wider mr-1">Topic</span>
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat.key;
          const count = cat.key === 'all'
            ? Object.values(paperCounts).reduce((a, b) => a + b, 0)
            : (paperCounts[cat.key] || 0);
          return (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className="relative px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? cat.color : 'var(--bg-alt)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="category-bg"
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: cat.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">
                {cat.title}
                <span className="ml-1 opacity-70">{count}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-faint uppercase tracking-wider mr-1">Type</span>
        {typeFilters.map((type) => {
          const isActive = activeType === type.key;
          let count = 0;
          if (type.key === 'all') count = Object.values(paperCounts).reduce((a, b) => a + b, 0);
          else if (type.key === 'awarded') count = awardCount;
          else if (type.key === 'under-review') count = underReviewCount;

          if (type.key !== 'all' && count === 0) return null;

          return (
            <button
              key={type.key}
              onClick={() => onTypeChange(type.key)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? '#3D78F5' : 'var(--bg-alt)',
              }}
            >
              {type.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
