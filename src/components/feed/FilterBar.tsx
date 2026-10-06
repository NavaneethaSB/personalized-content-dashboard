"use client";

import React from "react";
import {
  Newspaper,
  Film,
  Users,
  Layers,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSourceFilter,
  setCategoryFilter,
  resetFeedOrder,
} from "@/store/slices/feedSlice";
import { ContentCategory, ContentType } from "@/types";
import { translations } from "@/lib/i18n";

interface FilterBarProps {
  isDragMode: boolean;
  onToggleDragMode: () => void;
}

export function FilterBar({ isDragMode, onToggleDragMode }: FilterBarProps) {
  const dispatch = useAppDispatch();
  const activeSource = useAppSelector((state) => state.feed.activeSourceFilter);
  const activeCategory = useAppSelector((state) => state.feed.activeCategoryFilter);
  const userOrderModified = useAppSelector((state) => state.feed.userOrderModified);
  const preferredCategories = useAppSelector((state) => state.preferences.categories);
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  const sourceTabs: { id: ContentType | "all"; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: t.filterAll, icon: <Layers className="w-4 h-4" /> },
    { id: "news", label: t.filterNews, icon: <Newspaper className="w-4 h-4" /> },
    { id: "recommendation", label: t.filterRecommendations, icon: <Film className="w-4 h-4" /> },
    { id: "social", label: t.filterSocial, icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Top Source Tabs & Reorder Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Source Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#090f1d] rounded-2xl border border-slate-200/60 dark:border-[#162238] overflow-x-auto max-w-full shadow-inner">
          {sourceTabs.map((tab) => {
            const isActive = activeSource === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch(setSourceFilter(tab.id))}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-gradient-to-r dark:from-indigo-600 dark:to-purple-600 text-indigo-600 dark:text-white shadow-md dark:shadow-indigo-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-[#121a2d]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Drag & Reorder Actions */}
        <div className="flex items-center gap-2">
          {userOrderModified && (
            <button
              onClick={() => dispatch(resetFeedOrder())}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#101726] border border-slate-200 dark:border-[#162238] transition-colors"
              title="Reset custom drag-and-drop order"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetOrder}</span>
            </button>
          )}

          <button
            onClick={onToggleDragMode}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isDragMode
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30"
                : "bg-slate-100 dark:bg-[#0c1322] border border-transparent dark:border-[#182338] text-slate-700 dark:text-indigo-300 hover:bg-slate-200 dark:hover:bg-[#152038]"
            }`}
            title="Enable or disable card reordering"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{isDragMode ? "Done Reordering" : t.reorderFeed}</span>
          </button>
        </div>
      </div>

      {/* Category Pills based on user preferences */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => dispatch(setCategoryFilter("all"))}
          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
            activeCategory === "all"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md"
              : "bg-slate-100 dark:bg-[#090f1d] border border-transparent dark:border-[#141e30] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#121a2d] hover:dark:text-slate-200"
          }`}
        >
          All Topics
        </button>

        {preferredCategories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => dispatch(setCategoryFilter(cat))}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-md shadow-indigo-500/25"
                  : "bg-slate-100 dark:bg-[#090f1d] border border-transparent dark:border-[#141e30] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#121a2d] hover:dark:border-indigo-500/40 hover:dark:text-indigo-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
