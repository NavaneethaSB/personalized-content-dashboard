import { describe, it, expect, beforeEach } from "vitest";
import preferencesReducer, {
  toggleCategory,
  toggleSource,
  setTheme,
  resetPreferences,
} from "@/store/slices/preferencesSlice";

describe("preferencesSlice", () => {
  const initial = {
    categories: ["technology", "sports", "finance", "entertainment", "science", "health"] as any[],
    sources: { news: true, recommendations: true, social: true },
    theme: "dark" as const,
    density: "comfortable" as const,
    viewMode: "grid" as const,
    paginationMode: "infinite" as const,
    itemsPerPage: 6,
    autoRefresh: true,
    refreshInterval: 30,
    language: "en" as const,
  };

  it("should toggle a category off if more than one category exists", () => {
    const state = preferencesReducer(initial, toggleCategory("sports"));
    expect(state.categories).not.toContain("sports");
    expect(state.categories).toContain("technology");
  });

  it("should not allow deselecting the last category", () => {
    const singleCategoryState = { ...initial, categories: ["technology"] as any[] };
    const state = preferencesReducer(singleCategoryState, toggleCategory("technology"));
    expect(state.categories).toEqual(["technology"]);
  });

  it("should toggle source channels", () => {
    const state = preferencesReducer(initial, toggleSource("news"));
    expect(state.sources.news).toBe(false);
  });

  it("should update color theme", () => {
    const state = preferencesReducer(initial, setTheme("light"));
    expect(state.theme).toBe("light");
  });

  it("should reset preferences to defaults", () => {
    const modified = { ...initial, theme: "light" as const, categories: ["finance"] as any[] };
    const state = preferencesReducer(modified, resetPreferences());
    expect(state.categories.length).toBe(6);
  });
});
