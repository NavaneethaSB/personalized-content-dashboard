"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  ExternalLink,
  Heart,
  MessageSquare,
  Share2,
  Star,
  Clock,
  GripVertical,
  Check,
  Play,
  BookOpen,
} from "lucide-react";
import { ContentItem } from "@/types";
import { Badge } from "@/components/common/Badge";
import { formatRelativeTime, formatNumber } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/favoritesSlice";

interface ContentCardProps {
  item: ContentItem;
  onOpenModal: (item: ContentItem) => void;
  isDragEnabled?: boolean;
}

export function ContentCard({
  item,
  onOpenModal,
  isDragEnabled = false,
}: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorited = favoriteIds.includes(item.id);
  const [copied, setCopied] = useState(false);
  const [likeCount, setLikeCount] = useState(item.metrics?.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikeCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(item.url || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSourceBadgeVariant = () => {
    switch (item.type) {
      case "news":
        return "primary";
      case "recommendation":
        return "purple";
      case "social":
        return "success";
      default:
        return "default";
    }
  };

  const getCtaLabel = () => {
    if (item.mediaType === "movie" || item.mediaType === "show") return "Watch Preview";
    if (item.mediaType === "music") return "Play Audio";
    if (item.type === "social") return "View Discussion";
    return "Read Story";
  };

  return (
    <motion.article
      layout
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#152033] hover:dark:border-indigo-500/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl dark:hover:shadow-[0_16px_40px_-10px_rgba(99,102,241,0.22)] transition-all duration-300"
    >
      {/* Top Banner / Image Area */}
      {item.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-[#060a14]">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Vignette gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Type Badge & Category */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap z-10">
            <Badge variant={getSourceBadgeVariant()} size="sm" className="backdrop-blur-md font-bold shadow-xs">
              {item.type.toUpperCase()}
            </Badge>
            <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/70 text-slate-200 border border-white/10 backdrop-blur-md">
              {item.category}
            </span>
          </div>

          {/* Drag Handle (if active) */}
          {isDragEnabled && (
            <div
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/70 border border-white/10 text-white/90 cursor-grab active:cursor-grabbing backdrop-blur-md hover:bg-black/90 transition-colors z-10"
              title="Drag to reorder card"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Rating or Read Time Badge */}
          {item.rating && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 z-10">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
          {!item.rating && item.readTime && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/70 border border-white/10 text-slate-200 text-xs backdrop-blur-md z-10 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{item.readTime}</span>
            </div>
          )}
        </div>
      )}

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Source info & timestamp */}
        <div className="flex items-center justify-between mb-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            {item.source.avatar && (
              <img
                src={item.source.avatar}
                alt={item.source.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-indigo-500/30"
              />
            )}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.source.name}
            </span>
            {item.source.verified && (
              <span className="text-cyan-400 font-bold" title="Verified source">
                ✓
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">{formatRelativeTime(item.publishedAt)}</span>
        </div>

        {/* Headline */}
        <h3
          onClick={() => onOpenModal(item)}
          className="text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors mb-2 leading-snug"
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#10182b] text-slate-600 dark:text-indigo-300 dark:border dark:border-indigo-500/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Controls & Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#152033] flex items-center justify-between gap-2 mt-auto">
          {/* Like & Comments */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${
                hasLiked ? "text-rose-500 dark:text-rose-400 font-semibold drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" : ""
              }`}
              title="Like item"
            >
              <Heart
                className={`w-4 h-4 ${hasLiked ? "fill-current" : ""}`}
              />
              <span>{formatNumber(likeCount)}</span>
            </button>

            {item.metrics?.comments !== undefined && (
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{formatNumber(item.metrics.comments)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Favorite, Share, CTA */}
          <div className="flex items-center gap-1.5">
            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#141d31] transition-colors"
              title={copied ? "Link copied!" : "Share article"}
              aria-label="Share article"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Favorite / Bookmark */}
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-lg transition-all ${
                isFavorited
                  ? "text-amber-400 bg-amber-400/15 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                  : "text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-[#141d31]"
              }`}
              title={isFavorited ? "Saved in favorites" : "Save to favorites"}
              aria-label="Bookmark item"
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </button>

            {/* Call to action */}
            <button
              onClick={() => onOpenModal(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95 focus:ring-2 focus:ring-indigo-500"
            >
              {item.mediaType === "movie" || item.mediaType === "show" ? (
                <Play className="w-3 h-3 fill-current" />
              ) : (
                <BookOpen className="w-3 h-3" />
              )}
              <span>{getCtaLabel()}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
