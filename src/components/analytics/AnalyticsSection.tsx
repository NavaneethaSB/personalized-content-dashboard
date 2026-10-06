"use client";

import React from "react";
import {
  BarChart3,
  Bookmark,
  Layers,
  Heart,
  Sparkles,
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
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] shadow-xs hover:dark:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Stream Items
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {feedItems.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multi-source synchronized</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] shadow-xs hover:dark:border-amber-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Curated Favorites
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {favoriteItems.length}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Persisted in local storage</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] shadow-xs hover:dark:border-rose-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Community Engagement
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {(totalLikes / 1000).toFixed(1)}k
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Aggregated reactions</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] shadow-xs hover:dark:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topics Configured
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {preferredCategories.length} / 6
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Personalized algorithm</p>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution in Feed
            </h3>
            <BarChart3 className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-3.5 pt-2">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / (feedItems.length || 1)) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">
                      {cat}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{count} items ({percentage}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#121929] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Favorites Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#162238] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Favorites Source Breakdown
            </h3>
            <Bookmark className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-3.5 pt-2">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  News Articles
                </span>
                <span className="text-slate-500 dark:text-slate-400">{favNews} saved</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#121929] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{
                    width: `${favoriteItems.length ? (favNews / favoriteItems.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Movie & Show Recommendations
                </span>
                <span className="text-slate-500 dark:text-slate-400">{favRecs} saved</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#121929] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{
                    width: `${favoriteItems.length ? (favRecs / favoriteItems.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  Social Discussions
                </span>
                <span className="text-slate-500 dark:text-slate-400">{favSocial} saved</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-[#121929] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
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
