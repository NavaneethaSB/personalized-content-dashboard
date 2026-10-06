"use client";

import React from "react";
import {
  BarChart3,
  TrendingUp,
  Bookmark,
  Clock,
  Sparkles,
  Layers,
  Heart,
  Eye,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export function AnalyticsSection() {
  const feedItems = useAppSelector((state) => state.feed.items);
  const favoriteItems = useAppSelector((state) => state.favorites.items);
  const preferredCategories = useAppSelector((state) => state.preferences.categories);

  const totalLikes = feedItems.reduce((acc, curr) => acc + (curr.metrics?.likes || 0), 0);
  const totalViews = feedItems.reduce((acc, curr) => acc + (curr.metrics?.views || 0), 0);

  // Category counts
  const categoryCounts: Record<string, number> = {};
  feedItems.forEach((i) => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  // Source breakdown of favorites
  const favNews = favoriteItems.filter((i) => i.type === "news").length;
  const favRecs = favoriteItems.filter((i) => i.type === "recommendation").length;
  const favSocial = favoriteItems.filter((i) => i.type === "social").length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Stream Items
            </span>
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {feedItems.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Multi-source synchronized</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Curated Favorites
            </span>
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {favoriteItems.length}
          </div>
          <p className="text-xs text-slate-500 mt-1">Persisted locally</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-rose-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Community Engagement
            </span>
            <Heart className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {(totalLikes / 1000).toFixed(1)}k
          </div>
          <p className="text-xs text-slate-500 mt-1">Total aggregated likes</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-emerald-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topics Configured
            </span>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {preferredCategories.length} / 6
          </div>
          <p className="text-xs text-slate-500 mt-1">Personalized algorithm</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution in Feed
            </h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / (feedItems.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">
                      {cat}
                    </span>
                    <span className="text-slate-500">{count} items ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Favorites Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Favorites Source Breakdown
            </h3>
            <Bookmark className="w-5 h-5 text-amber-500" />
          </div>
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  News Articles
                </span>
                <span className="text-slate-500">{favNews} saved</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${favoriteItems.length ? (favNews / favoriteItems.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Movie & Show Recommendations
                </span>
                <span className="text-slate-500">{favRecs} saved</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{
                    width: `${favoriteItems.length ? (favRecs / favoriteItems.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Social Discussions
                </span>
                <span className="text-slate-500">{favSocial} saved</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${favoriteItems.length ? (favSocial / favoriteItems.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
