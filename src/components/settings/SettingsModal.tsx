"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import {
  Check,
  RotateCcw,
  Key,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleCategory,
  toggleSource,
  setTheme,
  setViewMode,
  setPaginationMode,
  setLanguage,
  setCustomApiKeys,
  resetPreferences,
} from "@/store/slices/preferencesSlice";
import { fetchDashboardFeed } from "@/store/slices/feedSlice";
import { ContentCategory } from "@/types";
import { Language, translations } from "@/lib/i18n";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const dispatch = useAppDispatch();
  const prefs = useAppSelector((state) => state.preferences);
  const [newsKey, setNewsKey] = useState(prefs.customApiKeys?.newsApiKey || "");
  const [tmdbKey, setTmdbKey] = useState(prefs.customApiKeys?.tmdbApiKey || "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const t = translations[prefs.language] || translations.en;

  const allCategories: { id: ContentCategory; label: string; desc: string }[] = [
    { id: "technology", label: "Technology", desc: "AI, engineering, web frameworks, hardware" },
    { id: "finance", label: "Finance", desc: "Markets, fintech, macroeconomics, crypto" },
    { id: "sports", label: "Sports", desc: "Championships, basketball, athletics, racing" },
    { id: "science", label: "Science", desc: "Space exploration, quantum physics, biology" },
    { id: "entertainment", label: "Entertainment", desc: "Cinema, streaming, gaming, soundtracks" },
    { id: "health", label: "Health & Medicine", desc: "Biotech, wellness, medical research" },
  ];

  const handleSaveApiKeys = () => {
    dispatch(
      setCustomApiKeys({
        newsApiKey: newsKey.trim(),
        tmdbApiKey: tmdbKey.trim(),
      })
    );
    dispatch(fetchDashboardFeed());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.settings} maxWidth="2xl">
      <div className="space-y-6">
        {/* Category Preferences */}
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
            {t.categories}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Choose which topics populate your personalized multi-source algorithm.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allCategories.map((cat) => {
              const isSelected = prefs.categories.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    dispatch(toggleCategory(cat.id));
                    dispatch(fetchDashboardFeed());
                  }}
                  className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo-500/60 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-900 dark:text-white shadow-xs dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-slate-200 dark:border-[#162238] dark:bg-[#0a0f1d] hover:border-slate-300 dark:hover:border-[#223555] text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                      isSelected
                        ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                        : "border-slate-300 dark:border-[#223555]"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{cat.label}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {cat.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sources */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#141e30]">
          <h4 className="text-xs font-bold text-slate-900 dark:text-indigo-300 uppercase tracking-wider mb-1">
            {t.sources}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Enable or disable individual API streaming channels.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: "news" as const, label: "News Stream", desc: "HackerNews & NewsAPI" },
              { id: "recommendations" as const, label: "Recommendations", desc: "TVMaze & TMDB" },
              { id: "social" as const, label: "Social Feeds", desc: "Reddit & Mastodon" },
            ].map((src) => {
              const isEnabled = prefs.sources[src.id];
              return (
                <button
                  key={src.id}
                  onClick={() => {
                    dispatch(toggleSource(src.id));
                    dispatch(fetchDashboardFeed());
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isEnabled
                      ? "border-indigo-500/60 bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-900 dark:text-white font-semibold dark:shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "border-slate-200 dark:border-[#162238] dark:bg-[#0a0f1d] text-slate-500 dark:text-slate-500 opacity-60"
                  }`}
                >
                  <div className="text-xs">{src.label}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{src.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* UI Layout & Pagination Options */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#141e30] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Display Mode */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-2">
              Feed Display Mode
            </label>
            <div className="flex rounded-2xl bg-slate-100 dark:bg-[#080d1a] border border-transparent dark:border-[#141f33] p-1 shadow-inner">
              <button
                onClick={() => dispatch(setViewMode("grid"))}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  prefs.viewMode === "grid"
                    ? "bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 text-indigo-600 dark:text-white shadow-md dark:shadow-indigo-600/30"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Responsive Grid
              </button>
              <button
                onClick={() => dispatch(setViewMode("list"))}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  prefs.viewMode === "list"
                    ? "bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 text-indigo-600 dark:text-white shadow-md dark:shadow-indigo-600/30"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Compact List
              </button>
            </div>
          </div>

          {/* Pagination Mode */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-2">
              Pagination Style
            </label>
            <div className="flex rounded-2xl bg-slate-100 dark:bg-[#080d1a] border border-transparent dark:border-[#141f33] p-1 shadow-inner">
              <button
                onClick={() => dispatch(setPaginationMode("infinite"))}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  prefs.paginationMode === "infinite"
                    ? "bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 text-indigo-600 dark:text-white shadow-md dark:shadow-indigo-600/30"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Infinite Scrolling
              </button>
              <button
                onClick={() => dispatch(setPaginationMode("pagination"))}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  prefs.paginationMode === "pagination"
                    ? "bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 text-indigo-600 dark:text-white shadow-md dark:shadow-indigo-600/30"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Numbered Pages
              </button>
            </div>
          </div>
        </div>

        {/* Theme & Language */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#141e30] grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Theme */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "dark" as const, label: "Dark" },
                { id: "light" as const, label: "Light" },
                { id: "system" as const, label: "System" },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => handleThemeChange(th.id)}
                  className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                    prefs.theme === th.id
                      ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 shadow-xs"
                      : "border-slate-200 dark:border-[#162238] dark:bg-[#0a0f1d] text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Language switcher */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300 block mb-2">
              Language (i18n)
            </label>
            <select
              value={prefs.language}
              onChange={(e) => dispatch(setLanguage(e.target.value as Language))}
              className="w-full px-3 py-2 text-xs bg-slate-100 dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] rounded-xl text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              <option value="en">English (US)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="de">Deutsch (German)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>

        {/* Custom API Keys Configuration */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#141e30] space-y-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-indigo-300">
              Custom API Keys (Optional)
            </h4>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Out of the box, PulseHub connects to TVMaze, Hacker News, and Reddit APIs without requiring any key. You may also provide your personal keys below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">NewsAPI Key</label>
              <input
                type="password"
                value={newsKey}
                onChange={(e) => setNewsKey(e.target.value)}
                placeholder="e.g. 8fa12c..."
                className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-[#182640] text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">TMDB API Key</label>
              <input
                type="password"
                value={tmdbKey}
                onChange={(e) => setTmdbKey(e.target.value)}
                placeholder="e.g. 43a29b..."
                className="w-full px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#080d1a] rounded-xl border border-slate-200 dark:border-[#182640] text-slate-900 dark:text-slate-100 outline-none focus:border-indigo-500 shadow-inner"
              />
            </div>
          </div>
          <button
            onClick={handleSaveApiKeys}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
            <span>{savedSuccess ? "Saved Successfully" : "Apply Keys"}</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#141e30] flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm("Reset all settings to default configuration?")) {
                dispatch(resetPreferences());
                dispatch(fetchDashboardFeed());
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-md shadow-indigo-600/30 active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
}
