export interface Author {
  name: string;
  me?: boolean;
  role?: 'first' | 'corresponding' | 'co-first' | null;
}

export interface Venue {
  short: string;
  full: string;
  type: 'conference' | 'journal' | 'workshop';
}

export interface Paper {
  id: string;
  title: string;
  authors: Author[];
  venue: Venue;
  year: number;
  category: string;
  doi?: string;
  pdf?: string;
  image?: string;
  video?: string;
  abstract?: string;
  award?: string;
  status: 'published' | 'under-review' | 'preprint';
  featured?: boolean;
  tags?: string[];
}

export interface ResearchArea {
  key: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}
