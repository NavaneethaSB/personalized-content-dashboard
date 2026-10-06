import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { FeedList } from "@/components/feed/FeedList";
import { FilterBar } from "@/components/feed/FilterBar";
import feedReducer, { setSearchQuery } from "@/store/slices/feedSlice";
import preferencesReducer from "@/store/slices/preferencesSlice";
import favoritesReducer from "@/store/slices/favoritesSlice";
import { initialMockContent } from "@/lib/mockData";

function renderDashboardFeed(customFeedState = {}) {
  const store = configureStore({
    reducer: {
      feed: feedReducer,
      preferences: preferencesReducer,
      favorites: favoritesReducer,
    },
    preloadedState: {
      feed: {
        items: initialMockContent,
        filteredItems: initialMockContent,
        status: "succeeded" as const,
        error: null,
        searchQuery: "",
        activeSourceFilter: "all" as const,
        activeCategoryFilter: "all" as const,
        currentPage: 1,
        hasMore: true,
        userOrderModified: false,
        ...customFeedState,
      },
    } as any,
  });

  return {
    ...render(
      <Provider store={store}>
        <div>
          <FilterBar isDragMode={false} onToggleDragMode={() => {}} />
          <FeedList onOpenArticle={() => {}} isDragMode={false} />
        </div>
      </Provider>
    ),
    store,
  };
}

describe("Feed Integration Tests", () => {
  it("renders multi-source feed items properly", () => {
    renderDashboardFeed();
    expect(screen.getByText("All Streams")).toBeInTheDocument();
    expect(screen.getByText("News")).toBeInTheDocument();
    expect(screen.getByText("Recommendations")).toBeInTheDocument();
    expect(screen.getByText("Social Feed")).toBeInTheDocument();

    // Verify presence of initial items
    expect(
      screen.getByText(/Next-Gen AI Agents Achieve Autonomous Code Synthesis/i)
    ).toBeInTheDocument();
  });

  it("handles empty state when no content matches filter", () => {
    renderDashboardFeed({
      items: [],
      filteredItems: [],
    });

    expect(screen.getByText(/No content matched your current filters/i)).toBeInTheDocument();
  });

  it("handles error state with retry action button", () => {
    renderDashboardFeed({
      items: [],
      filteredItems: [],
      status: "failed",
      error: "Internal Server Network Timeout",
    });

    expect(screen.getByText(/Unable to Load Content Stream/i)).toBeInTheDocument();
    expect(screen.getByText("Internal Server Network Timeout")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();
  });

  it("filters feed items by source when clicking source tab", () => {
    const { store } = renderDashboardFeed();

    const newsTab = screen.getByText("News");
    fireEvent.click(newsTab);

    expect(store.getState().feed.activeSourceFilter).toBe("news");
    expect(
      store.getState().feed.filteredItems.every((item) => item.type === "news")
    ).toBe(true);
  });
});
