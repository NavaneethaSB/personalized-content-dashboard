import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem, ContentCategory, ContentType } from "@/types";
import { initialMockContent } from "@/lib/mockData";

interface FeedState {
  items: ContentItem[];
  filteredItems: ContentItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  searchQuery: string;
  activeSourceFilter: ContentType | "all";
  activeCategoryFilter: ContentCategory | "all";
  currentPage: number;
  hasMore: boolean;
  userOrderModified: boolean;
}

const initialState: FeedState = {
  items: [],
  filteredItems: [],
  status: "idle",
  error: null,
  searchQuery: "",
  activeSourceFilter: "all",
  activeCategoryFilter: "all",
  currentPage: 1,
  hasMore: true,
  userOrderModified: false,
};

// Async thunk to fetch unified feed
export const fetchDashboardFeed = createAsyncThunk(
  "feed/fetchDashboardFeed",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const prefs = state.preferences;

      // Fetch from internal Next.js API routes with fallbacks
      const promises: Promise<Response>[] = [];

      if (prefs.sources.news) {
        promises.push(fetch(`/api/news?category=all`));
      }
      if (prefs.sources.recommendations) {
        promises.push(fetch(`/api/recommendations?category=all`));
      }
      if (prefs.sources.social) {
        promises.push(fetch(`/api/social?category=all`));
      }

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map((r) => (r.ok ? r.json() : { items: [] })));

      let aggregated: ContentItem[] = [];
      results.forEach((res) => {
        if (res.items && Array.isArray(res.items)) {
          aggregated.push(...res.items);
        }
      });

      if (aggregated.length === 0) {
        aggregated = initialMockContent;
      }

      // Interleave items for an engaging multi-source feed experience
      const newsItems = aggregated.filter((i) => i.type === "news");
      const recItems = aggregated.filter((i) => i.type === "recommendation");
      const socialItems = aggregated.filter((i) => i.type === "social");

      const maxLength = Math.max(newsItems.length, recItems.length, socialItems.length);
      const interleaved: ContentItem[] = [];

      for (let i = 0; i < maxLength; i++) {
        if (newsItems[i]) interleaved.push(newsItems[i]);
        if (recItems[i]) interleaved.push(recItems[i]);
        if (socialItems[i]) interleaved.push(socialItems[i]);
      }

      return interleaved.length > 0 ? interleaved : initialMockContent;
    } catch (err: any) {
      console.warn("Feed fetch error, using fallback data:", err);
      return initialMockContent;
    }
  }
);

function applyFilters(
  items: ContentItem[],
  query: string,
  source: ContentType | "all",
  category: ContentCategory | "all"
): ContentItem[] {
  let result = [...items];

  // Filter by Source (News, Recs, Social)
  if (source !== "all") {
    result = result.filter((item) => item.type === source);
  }

  // Filter by Category
  if (category !== "all") {
    result = result.filter((item) => item.category === category);
  }

  // Filter by Debounced Search Query
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.source.name.toLowerCase().includes(q) ||
        item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return result;
}

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
      state.filteredItems = applyFilters(
        state.items,
        action.payload,
        state.activeSourceFilter,
        state.activeCategoryFilter
      );
    },
    setSourceFilter: (state, action: PayloadAction<ContentType | "all">) => {
      state.activeSourceFilter = action.payload;
      state.currentPage = 1;
      state.filteredItems = applyFilters(
        state.items,
        state.searchQuery,
        action.payload,
        state.activeCategoryFilter
      );
    },
    setCategoryFilter: (state, action: PayloadAction<ContentCategory | "all">) => {
      state.activeCategoryFilter = action.payload;
      state.currentPage = 1;
      state.filteredItems = applyFilters(
        state.items,
        state.searchQuery,
        state.activeSourceFilter,
        action.payload
      );
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    reorderFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      state.filteredItems = action.payload;
      state.userOrderModified = true;
    },
    resetFeedOrder: (state) => {
      state.userOrderModified = false;
      state.filteredItems = applyFilters(
        state.items,
        state.searchQuery,
        state.activeSourceFilter,
        state.activeCategoryFilter
      );
    },
    prependLiveItem: (state, action: PayloadAction<ContentItem>) => {
      const newItem = action.payload;
      // Prevent duplicates
      if (!state.items.some((i) => i.id === newItem.id)) {
        state.items = [newItem, ...state.items];
        state.filteredItems = applyFilters(
          state.items,
          state.searchQuery,
          state.activeSourceFilter,
          state.activeCategoryFilter
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardFeed.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDashboardFeed.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.filteredItems = applyFilters(
          action.payload,
          state.searchQuery,
          state.activeSourceFilter,
          state.activeCategoryFilter
        );
      })
      .addCase(fetchDashboardFeed.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load feed";
        state.items = initialMockContent;
        state.filteredItems = applyFilters(
          initialMockContent,
          state.searchQuery,
          state.activeSourceFilter,
          state.activeCategoryFilter
        );
      });
  },
});

export const {
  setSearchQuery,
  setSourceFilter,
  setCategoryFilter,
  setCurrentPage,
  reorderFeedItems,
  resetFeedOrder,
  prependLiveItem,
} = feedSlice.actions;

export default feedSlice.reducer;
