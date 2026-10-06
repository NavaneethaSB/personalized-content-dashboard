import { configureStore } from "@reduxjs/toolkit";
import preferencesReducer from "./slices/preferencesSlice";
import feedReducer from "./slices/feedSlice";
import favoritesReducer from "./slices/favoritesSlice";
import trendingReducer from "./slices/trendingSlice";
import authReducer from "./slices/authSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      preferences: preferencesReducer,
      feed: feedReducer,
      favorites: favoritesReducer,
      trending: trendingReducer,
      auth: authReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
