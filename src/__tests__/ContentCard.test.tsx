import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ContentCard } from "@/components/feed/ContentCard";
import favoritesReducer from "@/store/slices/favoritesSlice";
import preferencesReducer from "@/store/slices/preferencesSlice";
import { ContentItem } from "@/types";

const mockContentItem: ContentItem = {
  id: "card-test-1",
  type: "news",
  mediaType: "article",
  category: "technology",
  title: "Superconductor Breakthrough in Materials Science",
  description: "Ambient pressure superconductivity verified across multiple independent labs.",
  imageUrl: "https://images.unsplash.com/photo-test",
  source: {
    name: "Science Daily",
    handle: "@sciencedaily",
    verified: true,
  },
  url: "https://sciencedaily.com/test",
  publishedAt: new Date().toISOString(),
  readTime: "4 min read",
  tags: ["Physics", "Materials"],
  metrics: { likes: 500, comments: 40, views: 5000 },
};

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: {
      favorites: favoritesReducer,
      preferences: preferencesReducer,
    },
  });

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}

describe("ContentCard Component", () => {
  it("renders card title, description, and source correctly", () => {
    const handleOpenModal = vi.fn();
    renderWithStore(
      <ContentCard item={mockContentItem} onOpenModal={handleOpenModal} />
    );

    expect(screen.getByText("Superconductor Breakthrough in Materials Science")).toBeInTheDocument();
    expect(
      screen.getByText("Ambient pressure superconductivity verified across multiple independent labs.")
    ).toBeInTheDocument();
    expect(screen.getByText("Science Daily")).toBeInTheDocument();
    expect(screen.getByText("#Physics")).toBeInTheDocument();
  });

  it("triggers onOpenModal when clicking headline or CTA button", () => {
    const handleOpenModal = vi.fn();
    renderWithStore(
      <ContentCard item={mockContentItem} onOpenModal={handleOpenModal} />
    );

    const ctaButton = screen.getByText("Read Story");
    fireEvent.click(ctaButton);
    expect(handleOpenModal).toHaveBeenCalledWith(mockContentItem);
  });

  it("handles like button interaction and updates like count", () => {
    const handleOpenModal = vi.fn();
    renderWithStore(
      <ContentCard item={mockContentItem} onOpenModal={handleOpenModal} />
    );

    const likeButton = screen.getByTitle("Like item");
    expect(likeButton).toHaveTextContent("500");

    fireEvent.click(likeButton);
    expect(likeButton).toHaveTextContent("501");

    fireEvent.click(likeButton);
    expect(likeButton).toHaveTextContent("500");
  });

  it("toggles favorite bookmark in redux store when bookmark clicked", () => {
    const handleOpenModal = vi.fn();
    const { store } = renderWithStore(
      <ContentCard item={mockContentItem} onOpenModal={handleOpenModal} />
    );

    const bookmarkButton = screen.getByLabelText("Bookmark item");
    fireEvent.click(bookmarkButton);

    expect(store.getState().favorites.favoriteIds).toContain("card-test-1");

    fireEvent.click(bookmarkButton);
    expect(store.getState().favorites.favoriteIds).not.toContain("card-test-1");
  });
});
