import { describe, it, expect } from "vitest";
import favoritesReducer, {
  toggleFavorite,
  removeFavoriteById,
  clearAllFavorites,
} from "@/store/slices/favoritesSlice";
import { ContentItem } from "@/types";

const mockItem: ContentItem = {
  id: "test-item-1",
  type: "news",
  mediaType: "article",
  category: "technology",
  title: "Test Article Title",
  description: "Test description",
  source: { name: "Test Source" },
  url: "https://example.com",
  publishedAt: new Date().toISOString(),
  tags: ["Tech"],
};

describe("favoritesSlice", () => {
  const emptyState = {
    items: [],
    favoriteIds: [],
    searchQuery: "",
  };

  it("should add item to favorites on toggle", () => {
    const state = favoritesReducer(emptyState, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.favoriteIds).toContain("test-item-1");
  });

  it("should remove item from favorites on second toggle", () => {
    const populatedState = {
      items: [mockItem],
      favoriteIds: ["test-item-1"],
      searchQuery: "",
    };
    const state = favoritesReducer(populatedState, toggleFavorite(mockItem));
    expect(state.items).toHaveLength(0);
    expect(state.favoriteIds).not.toContain("test-item-1");
  });

  it("should remove favorite by ID directly", () => {
    const populatedState = {
      items: [mockItem],
      favoriteIds: ["test-item-1"],
      searchQuery: "",
    };
    const state = favoritesReducer(populatedState, removeFavoriteById("test-item-1"));
    expect(state.items).toHaveLength(0);
  });

  it("should clear all favorites", () => {
    const populatedState = {
      items: [mockItem],
      favoriteIds: ["test-item-1"],
      searchQuery: "",
    };
    const state = favoritesReducer(populatedState, clearAllFavorites());
    expect(state.items).toHaveLength(0);
    expect(state.favoriteIds).toHaveLength(0);
  });
});
