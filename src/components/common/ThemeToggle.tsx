"use client";

import React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/slices/preferencesSlice";

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    dispatch(setTheme(newTheme));
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const cycleTheme = () => {
    if (theme === "dark") applyTheme("light");
    else if (theme === "light") applyTheme("dark");
    else applyTheme("dark");
  };

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#0d1424] dark:hover:bg-[#162138] border border-transparent dark:border-[#182338] transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      title={`Current theme: ${theme}. Click to switch.`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
      ) : theme === "light" ? (
        <Moon className="w-5 h-5 text-slate-700 transition-transform hover:-rotate-12" />
      ) : (
        <Monitor className="w-5 h-5 text-blue-500" />
      )}
    </button>
  );
}
