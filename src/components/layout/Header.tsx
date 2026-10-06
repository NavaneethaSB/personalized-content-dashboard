"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  Sliders,
  Bell,
  Menu,
  Sparkles,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useDebounce } from "@/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/feedSlice";
import { translations } from "@/lib/i18n";

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onToggleMobileMenu: () => void;
}

export function Header({
  onOpenSettings,
  onOpenProfile,
  onToggleMobileMenu,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const rawSearchQuery = useAppSelector((state) => state.feed.searchQuery);
  const userProfile = useAppSelector((state) => state.auth);
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  const [inputVal, setInputVal] = useState(rawSearchQuery);
  const debouncedSearch = useDebounce(inputVal, 350);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync debounced search to Redux store
  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Keyboard shortcut listener ('/' or 'Ctrl+K' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || (e.ctrlKey && e.key === "k")) &&
        document.activeElement !== searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = () => {
    setInputVal("");
    dispatch(setSearchQuery(""));
    searchInputRef.current?.focus();
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Mobile Drawer Hamburger */}
      <button
        onClick={onToggleMobileMenu}
        className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle mobile menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Debounced Search Bar */}
      <div className="flex-1 max-w-xl relative">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-20 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-2xs"
          />
          {inputVal ? (
            <button
              onClick={handleClear}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 absolute right-3 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md shadow-2xs">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Settings, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <ThemeToggle />

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          title="Open Preferences"
          aria-label="Open settings"
        >
          <Sliders className="w-5 h-5" />
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
          title="User Account"
        >
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/40"
          />
          <span className="hidden sm:inline text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
            {userProfile.name.split(" ")[0]}
          </span>
        </button>
      </div>
    </header>
  );
}
