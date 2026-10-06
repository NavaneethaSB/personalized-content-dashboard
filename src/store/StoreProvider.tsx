"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "./store";
import { initializePreferences } from "./slices/preferencesSlice";
import { initializeFavorites } from "./slices/favoritesSlice";
import { initializeAuth } from "./slices/authSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current) {
      storeRef.current.dispatch(initializePreferences());
      storeRef.current.dispatch(initializeFavorites());
      storeRef.current.dispatch(initializeAuth());

      // Sync dark mode class with root html element
      const state = storeRef.current.getState();
      const theme = state.preferences.theme;
      const root = document.documentElement;

      if (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
