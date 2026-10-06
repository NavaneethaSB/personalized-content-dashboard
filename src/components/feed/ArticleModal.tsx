"use client";

import React from "react";
import { Modal } from "@/components/common/Modal";
import { ContentItem } from "@/types";
import { Badge } from "@/components/common/Badge";
import { ExternalLink, Bookmark, Clock, Star } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#090e1a] via-[#090e1a]/40 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Badge variant="primary" size="sm">
                  {item.type.toUpperCase()}
                </Badge>
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-md bg-black/60 border border-white/10 backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              {item.rating && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/25">
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
                className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/40"
              />
            )}
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              {item.source.name}
            </span>
            {item.source.handle && (
              <span className="text-slate-400 dark:text-slate-500">{item.source.handle}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {item.readTime && (
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {item.readTime}
              </span>
            )}
            <span>{formatRelativeTime(item.publishedAt)}</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
          {item.title}
        </h2>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#10182b] text-slate-700 dark:text-indigo-300 font-medium border border-transparent dark:border-indigo-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Full Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line border-t border-b border-slate-100 dark:border-[#141f33] py-4">
          <p>{item.fullContent || item.description}</p>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(toggleFavorite(item))}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isFavorited
                  ? "bg-amber-400/15 text-amber-400 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "bg-slate-100 dark:bg-[#0c1220] border border-transparent dark:border-[#182640] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#141d31]"
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
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
