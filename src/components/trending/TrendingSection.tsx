"use client";

import React, { useEffect } from "react";
import {
  Flame,
  Newspaper,
  Film,
  Users,
  TrendingUp,
  Sparkles,
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
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-3">
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Real-Time Engagement Radar</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Trending Across the Web
          </h2>
          <p className="text-sm sm:text-base text-blue-100">
            Real-time viral stories, highest-rated cinematic recommendations, and top community discussions curated by algorithm score.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Category selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setTrendingCategory(cat.id))}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
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
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
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
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
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
