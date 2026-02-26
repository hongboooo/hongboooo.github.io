import { useState, useMemo } from 'react';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import FilterBar from './FilterBar';
import PaperCard from './PaperCard';
import type { Paper, ResearchArea } from '../types/paper';

interface PublicationListProps {
  papers: Paper[];
  categories: ResearchArea[];
}

export default function PublicationList({ papers, categories }: PublicationListProps) {
  // Read ?topic= from URL to support deep-linking from Research Directions
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window === 'undefined') return 'all';
    const param = new URLSearchParams(window.location.search).get('topic');
    if (param && categories.some((c) => c.key === param)) return param;
    return 'all';
  });
  const [activeType, setActiveType] = useState('all');

  // Count papers per category
  const paperCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of papers) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [papers]);

  const awardCount = useMemo(() => papers.filter((p) => p.award).length, [papers]);
  const underReviewCount = useMemo(() => papers.filter((p) => p.status === 'under-review').length, [papers]);

  // Filter papers
  const filtered = useMemo(() => {
    let result = papers;
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (activeType === 'awarded') {
      result = result.filter((p) => p.award);
    } else if (activeType === 'under-review') {
      result = result.filter((p) => p.status === 'under-review');
    }
    return result;
  }, [papers, activeCategory, activeType]);

  // Group by year (descending)
  const groupedByYear = useMemo(() => {
    const groups: Record<number, Paper[]> = {};
    for (const p of filtered) {
      if (!groups[p.year]) groups[p.year] = [];
      groups[p.year].push(p);
    }
    return Object.entries(groups)
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([year, papers]) => ({ year: Number(year), papers }));
  }, [filtered]);

  // Venue summary
  const venues = useMemo(() => {
    const set = new Set(papers.map((p) => p.venue.short));
    return Array.from(set).slice(0, 6).join(', ');
  }, [papers]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Publications
        </h1>
        <p className="text-muted text-lg">
          {papers.length} papers published at {venues}, and more.
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        activeType={activeType}
        onCategoryChange={setActiveCategory}
        onTypeChange={setActiveType}
        paperCounts={paperCounts}
        awardCount={awardCount}
        underReviewCount={underReviewCount}
      />

      {/* Paper list grouped by year */}
      <LayoutGroup>
        {groupedByYear.length === 0 ? (
          <p className="text-muted text-center py-12">No papers match the current filters.</p>
        ) : (
          <div className="space-y-8">
            {groupedByYear.map(({ year, papers: yearPapers }) => (
              <div key={year}>
                {/* Year divider */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-heading text-2xl font-bold text-faint">{year}</span>
                  <div className="flex-1 h-px bg-[var(--border-color)]" />
                  <span className="text-xs text-faint">{yearPapers.length} paper{yearPapers.length > 1 ? 's' : ''}</span>
                </div>

                {/* Papers */}
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {yearPapers.map((paper) => (
                      <PaperCard key={paper.id} paper={paper} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}
      </LayoutGroup>
    </div>
  );
}
