import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ContentItem } from "@/types";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

const FAVORITES_STORAGE_KEY = "pulsehub_favorites_items";

interface FavoritesState {
  items: ContentItem[];
  favoriteIds: string[];
  searchQuery: string;
}

const initialState: FavoritesState = {
  items: [],
  favoriteIds: [],
  searchQuery: "",
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    initializeFavorites: (state) => {
      const saved = loadFromLocalStorage<ContentItem[]>(FAVORITES_STORAGE_KEY, []);
      state.items = saved;
      state.favoriteIds = saved.map((i) => i.id);
    },
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const item = action.payload;
      const index = state.items.findIndex((i) => i.id === item.id);

      if (index >= 0) {
        state.items.splice(index, 1);
        state.favoriteIds = state.favoriteIds.filter((id) => id !== item.id);
      } else {
        state.items.unshift(item);
        state.favoriteIds.unshift(item.id);
      }

      saveToLocalStorage(FAVORITES_STORAGE_KEY, state.items);
    },
    removeFavoriteById: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.items = state.items.filter((i) => i.id !== id);
      state.favoriteIds = state.favoriteIds.filter((favId) => favId !== id);
      saveToLocalStorage(FAVORITES_STORAGE_KEY, state.items);
    },
    setFavoritesSearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearAllFavorites: (state) => {
      state.items = [];
      state.favoriteIds = [];
      saveToLocalStorage(FAVORITES_STORAGE_KEY, []);
    },
  },
});

export const {
  initializeFavorites,
  toggleFavorite,
  removeFavoriteById,
  setFavoritesSearch,
  clearAllFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
