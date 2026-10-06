"use client";

import React, { useEffect } from "react";
import {
  Flame,
  Newspaper,
  Film,
  Users,
} from "lucide-react";
import { ContentItem, ContentCategory } from "@/types";
import { ContentCard } from "@/components/feed/ContentCard";
import { ContentCardSkeleton } from "@/components/common/Skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchTrendingContent,
  setTrendingCategory,
} from "@/store/slices/trendingSlice";

interface TrendingSectionProps {
  onOpenArticle: (item: ContentItem) => void;
}

export function TrendingSection({ onOpenArticle }: TrendingSectionProps) {
  const dispatch = useAppDispatch();
  const { topNews, topRecommendations, topSocial, status, activeCategory } =
    useAppSelector((state) => state.trending);

  useEffect(() => {
    dispatch(fetchTrendingContent(activeCategory));
  }, [dispatch, activeCategory]);

  const categories: { id: ContentCategory | "all"; label: string }[] = [
    { id: "all", label: "All Trending" },
    { id: "technology", label: "Technology" },
    { id: "entertainment", label: "Entertainment" },
    { id: "finance", label: "Finance" },
    { id: "sports", label: "Sports" },
    { id: "science", label: "Science" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0b0e22] via-[#151036] to-[#200e36] border border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md text-xs font-bold text-indigo-300 mb-3 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>Real-Time Engagement Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
            Trending Across the Web
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Real-time viral stories, highest-rated cinematic recommendations, and top community discussions curated by algorithm score.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setTrendingCategory(cat.id))}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white shadow-md shadow-indigo-500/25"
                : "bg-slate-100 dark:bg-[#0a0f1d] border border-transparent dark:border-[#152033] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#121a2d] hover:dark:border-indigo-500/40 hover:dark:text-slate-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {status === "loading" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {/* Section 1: Trending News */}
          {topNews.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <Newspaper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Top Trending News
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    High-impact global headlines with highest reader velocity
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topNews.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onOpenModal={onOpenArticle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Top Recommendations */}
          {topRecommendations.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Must-Watch Recommendations
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Highest-rated cinematic masterpieces and binge-worthy series
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topRecommendations.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onOpenModal={onOpenArticle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Viral Social Discussions */}
          {topSocial.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Viral Community Discussions
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Active threads sparking the highest engagement and commentary
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topSocial.map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    onOpenModal={onOpenArticle}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
