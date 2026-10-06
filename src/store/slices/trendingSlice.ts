import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem, ContentCategory } from "@/types";
import { initialMockContent } from "@/lib/mockData";

interface TrendingState {
  items: ContentItem[];
  topNews: ContentItem[];
  topRecommendations: ContentItem[];
  topSocial: ContentItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  activeCategory: ContentCategory | "all";
}

const initialState: TrendingState = {
  items: [],
  topNews: [],
  topRecommendations: [],
  topSocial: [],
  status: "idle",
  error: null,
  activeCategory: "all",
};

export const fetchTrendingContent = createAsyncThunk(
  "trending/fetchTrendingContent",
  async (category: ContentCategory | "all" = "all") => {
    try {
      const res = await fetch(`/api/trending?category=${category}`);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn("Trending fetch failed, falling back to mock:", e);
    }

    const items = [...initialMockContent].sort((a, b) => (b.metrics?.likes || 0) - (a.metrics?.likes || 0));
    return {
      items,
      topNews: items.filter((i) => i.type === "news").slice(0, 4),
      topRecommendations: items.filter((i) => i.type === "recommendation").slice(0, 4),
      topSocial: items.filter((i) => i.type === "social").slice(0, 4),
    };
  }
);

export const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    setTrendingCategory: (state, action: PayloadAction<ContentCategory | "all">) => {
      state.activeCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingContent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTrendingContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items || [];
        state.topNews = action.payload.topNews || [];
        state.topRecommendations = action.payload.topRecommendations || [];
        state.topSocial = action.payload.topSocial || [];
      })
      .addCase(fetchTrendingContent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to load trending content";
      });
  },
});

export const { setTrendingCategory } = trendingSlice.actions;

export default trendingSlice.reducer;
