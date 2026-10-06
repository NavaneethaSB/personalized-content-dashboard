import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserPreferences, ContentCategory } from "@/types";
import { loadFromLocalStorage, saveToLocalStorage } from "@/lib/utils";

const STORAGE_KEY = "pulsehub_user_preferences";

const defaultPreferences: UserPreferences = {
  categories: ["technology", "sports", "finance", "entertainment", "science", "health"],
  sources: {
    news: true,
    recommendations: true,
    social: true,
  },
  theme: "dark",
  density: "comfortable",
  viewMode: "grid",
  paginationMode: "infinite",
  itemsPerPage: 6,
  autoRefresh: true,
  refreshInterval: 30,
  language: "en",
  customApiKeys: {
    newsApiKey: "",
    tmdbApiKey: "",
  },
};

const initialState: UserPreferences = defaultPreferences;

export const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    initializePreferences: (state) => {
      const saved = loadFromLocalStorage<UserPreferences | null>(STORAGE_KEY, null);
      if (saved) {
        return { ...state, ...saved };
      }
      return state;
    },
    toggleCategory: (state, action: PayloadAction<ContentCategory>) => {
      const cat = action.payload;
      if (cat === "all") return;
      if (state.categories.includes(cat)) {
        // Keep at least 1 category selected
        if (state.categories.length > 1) {
          state.categories = state.categories.filter((c) => c !== cat);
        }
      } else {
        state.categories.push(cat);
      }
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setCategories: (state, action: PayloadAction<ContentCategory[]>) => {
      state.categories = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    toggleSource: (state, action: PayloadAction<keyof UserPreferences["sources"]>) => {
      const src = action.payload;
      state.sources[src] = !state.sources[src];
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setTheme: (state, action: PayloadAction<UserPreferences["theme"]>) => {
      state.theme = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setDensity: (state, action: PayloadAction<UserPreferences["density"]>) => {
      state.density = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setViewMode: (state, action: PayloadAction<UserPreferences["viewMode"]>) => {
      state.viewMode = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setPaginationMode: (state, action: PayloadAction<UserPreferences["paginationMode"]>) => {
      state.paginationMode = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setLanguage: (state, action: PayloadAction<UserPreferences["language"]>) => {
      state.language = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    setCustomApiKeys: (state, action: PayloadAction<UserPreferences["customApiKeys"]>) => {
      state.customApiKeys = action.payload;
      saveToLocalStorage(STORAGE_KEY, state);
    },
    resetPreferences: () => {
      saveToLocalStorage(STORAGE_KEY, defaultPreferences);
      return defaultPreferences;
    },
  },
});

export const {
  initializePreferences,
  toggleCategory,
  setCategories,
  toggleSource,
  setTheme,
  setDensity,
  setViewMode,
  setPaginationMode,
  setItemsPerPage,
  setLanguage,
  setCustomApiKeys,
  resetPreferences,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
