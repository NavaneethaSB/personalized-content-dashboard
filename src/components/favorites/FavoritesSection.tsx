"use client";

import React, { useState } from "react";
import {
  Bookmark,
  Search,
  Trash2,
  Download,
  Share2,
  Check,
  FolderHeart,
} from "lucide-react";
import { ContentItem, ContentType } from "@/types";
import { ContentCard } from "@/components/feed/ContentCard";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  clearAllFavorites,
  setFavoritesSearch,
} from "@/store/slices/favoritesSlice";
import { translations } from "@/lib/i18n";

interface FavoritesSectionProps {
  onOpenArticle: (item: ContentItem) => void;
}

export function FavoritesSection({ onOpenArticle }: FavoritesSectionProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.favorites.items);
  const [filterType, setFilterType] = useState<ContentType | "all">("all");
  const [localSearch, setLocalSearch] = useState("");
  const [exported, setExported] = useState(false);
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  const filteredItems = items.filter((item) => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesSearch =
      !localSearch.trim() ||
      item.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.description.toLowerCase().includes(localSearch.toLowerCase()) ||
      item.source.name.toLowerCase().includes(localSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `pulsehub-favorites-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Bookmark className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t.favorites}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} saved {items.length === 1 ? "item" : "items"} available offline in local storage
            </p>
          </div>
        </div>

        {/* Action buttons */}
        {items.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
              title="Export favorites as JSON"
            >
              {exported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exported!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to clear all your saved favorites?")) {
                  dispatch(clearAllFavorites());
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Clear all favorites"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar for Favorites */}
      {items.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Type filters */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/60 dark:border-slate-700/60 w-full sm:w-auto">
            {(
              [
                { id: "all", label: "All Items" },
                { id: "news", label: "News" },
                { id: "recommendation", label: "Recommendations" },
                { id: "social", label: "Social" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filterType === tab.id
                    ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search inside favorites */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Filter saved items..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Grid or Empty State */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              onOpenModal={onOpenArticle}
            />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FolderHeart className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            {t.noFavoritesYet}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Click the bookmark icon on any card across your feed or trending tabs to curate your personal collection.
          </p>
        </div>
      )}
    </div>
  );
}
