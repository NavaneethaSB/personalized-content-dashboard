"use client";

import React from "react";
import {
  Newspaper,
  Film,
  Users,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
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
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-x-auto max-w-full">
          {sourceTabs.map((tab) => {
            const isActive = activeSource === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch(setSourceFilter(tab.id))}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title="Reset custom drag-and-drop order"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetOrder}</span>
            </button>
          )}

          <button
            onClick={onToggleDragMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isDragMode
                ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
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
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
            activeCategory === "all"
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
