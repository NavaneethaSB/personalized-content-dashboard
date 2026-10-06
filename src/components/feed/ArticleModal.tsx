"use client";

import React from "react";
import { Modal } from "@/components/common/Modal";
import { ContentItem } from "@/types";
import { Badge } from "@/components/common/Badge";
import { ExternalLink, Bookmark, Heart, Clock, Star, Share2 } from "lucide-react";
import { formatRelativeTime, formatNumber } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";

interface ArticleModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export function ArticleModal({ item, onClose }: ArticleModalProps) {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);

  if (!item) return null;

  const isFavorited = favoriteIds.includes(item.id);

  return (
    <Modal isOpen={Boolean(item)} onClose={onClose} maxWidth="2xl">
      <div className="space-y-5">
        {/* Banner image */}
        {item.imageUrl && (
          <div className="relative w-full h-64 sm:h-80 -mt-6 -mx-6 mb-4 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {item.type.toUpperCase()}
                </Badge>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              {item.rating && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-slate-950 font-bold text-sm shadow-md">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{item.rating.toFixed(1)} / 10</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Source metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {item.source.avatar && (
              <img
                src={item.source.avatar}
                alt={item.source.name}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="font-semibold text-slate-900 dark:text-white text-sm">
              {item.source.name}
            </span>
            {item.source.handle && (
              <span className="text-slate-400">{item.source.handle}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {item.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {item.readTime}
              </span>
            )}
            <span>{formatRelativeTime(item.publishedAt)}</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
          {item.title}
        </h2>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Full Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line border-t border-b border-slate-100 dark:border-slate-800 py-4">
          <p>{item.fullContent || item.description}</p>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleFavorite(item))}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isFavorited
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
              <span>{isFavorited ? "Saved in Favorites" : "Add to Favorites"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
            >
              <span>Visit Original Source</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}
