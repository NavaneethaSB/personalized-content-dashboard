export type ContentCategory =
  | "technology"
  | "sports"
  | "finance"
  | "entertainment"
  | "science"
  | "health"
  | "all";

export type ContentType = "news" | "recommendation" | "social";

export type MediaType = "article" | "movie" | "show" | "music" | "post";

export interface ContentSource {
  name: string;
  avatar?: string;
  url?: string;
  handle?: string;
  verified?: boolean;
}

export interface ContentMetrics {
  likes: number;
  comments: number;
  shares?: number;
  views?: number;
  score?: number;
}

export interface ContentItem {
  id: string;
  type: ContentType;
  mediaType: MediaType;
  category: ContentCategory;
  title: string;
  description: string;
  fullContent?: string;
  imageUrl?: string;
  source: ContentSource;
  url: string;
  publishedAt: string;
  readTime?: string;
  rating?: number; // For movies / shows (e.g., 8.7)
  tags: string[];
  metrics?: ContentMetrics;
  isCustomOrder?: number;
}

export interface UserPreferences {
  categories: ContentCategory[];
  sources: {
    news: boolean;
    recommendations: boolean;
    social: boolean;
  };
  theme: "light" | "dark" | "system";
  density: "comfortable" | "compact";
  viewMode: "grid" | "list";
  paginationMode: "infinite" | "pagination";
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  language: "en" | "es" | "fr" | "de" | "hi";
  customApiKeys?: {
    newsApiKey?: string;
    tmdbApiKey?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  isLoggedIn: boolean;
  savedCount?: number;
}

export type ActiveTab = "feed" | "trending" | "favorites" | "analytics" | "settings";
