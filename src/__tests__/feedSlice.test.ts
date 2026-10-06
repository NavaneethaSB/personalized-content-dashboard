import { describe, it, expect } from "vitest";
import feedReducer, {
  setSearchQuery,
  setSourceFilter,
  setCategoryFilter,
  reorderFeedItems,
  prependLiveItem,
} from "@/store/slices/feedSlice";
import { ContentItem } from "@/types";

const item1: ContentItem = {
  id: "item-1",
  type: "news",
  mediaType: "article",
  category: "technology",
  title: "React 19 Architecture",
  description: "Detailed overview of React 19 compiler.",
  source: { name: "TechCrunch" },
  url: "https://example.com/1",
  publishedAt: new Date().toISOString(),
  tags: ["React"],
};

const item2: ContentItem = {
  id: "item-2",
  type: "recommendation",
  mediaType: "movie",
  category: "entertainment",
  title: "Inception",
  description: "Dream within a dream.",
  source: { name: "Cinema" },
  url: "https://example.com/2",
  publishedAt: new Date().toISOString(),
  tags: ["Sci-Fi"],
};

describe("feedSlice", () => {
  const baseState = {
    items: [item1, item2],
    filteredItems: [item1, item2],
    status: "succeeded" as const,
    error: null,
    searchQuery: "",
    activeSourceFilter: "all" as const,
    activeCategoryFilter: "all" as const,
    currentPage: 1,
    hasMore: true,
    userOrderModified: false,
  };

  it("should filter items by search query", () => {
    const state = feedReducer(baseState, setSearchQuery("compiler"));
    expect(state.filteredItems).toHaveLength(1);
    expect(state.filteredItems[0].id).toBe("item-1");
  });

  it("should filter items by source type", () => {
    const state = feedReducer(baseState, setSourceFilter("recommendation"));
    expect(state.filteredItems).toHaveLength(1);
    expect(state.filteredItems[0].id).toBe("item-2");
  });

  it("should filter items by category", () => {
    const state = feedReducer(baseState, setCategoryFilter("entertainment"));
    expect(state.filteredItems).toHaveLength(1);
    expect(state.filteredItems[0].category).toBe("entertainment");
  });

  it("should reorder feed items when dragged", () => {
    const reordered = [item2, item1];
    const state = feedReducer(baseState, reorderFeedItems(reordered));
    expect(state.filteredItems[0].id).toBe("item-2");
    expect(state.userOrderModified).toBe(true);
  });

  it("should prepend new live incoming items", () => {
    const liveItem: ContentItem = {
      id: "live-item-99",
      type: "social",
      mediaType: "post",
      category: "technology",
      title: "Live breaking tweet",
      description: "Something just happened",
      source: { name: "Twitter" },
      url: "https://x.com",
      publishedAt: new Date().toISOString(),
      tags: ["Breaking"],
    };

    const state = feedReducer(baseState, prependLiveItem(liveItem));
    expect(state.items[0].id).toBe("live-item-99");
    expect(state.filteredItems[0].id).toBe("live-item-99");
  });
});
