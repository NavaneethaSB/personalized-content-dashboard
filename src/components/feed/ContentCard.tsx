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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-blue-500/5 transition-all duration-300"
    >
      {/* Top Banner / Image Area */}
      {item.imageUrl && (
        <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Type Badge & Category */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <Badge variant={getSourceBadgeVariant()} size="sm" className="backdrop-blur-md bg-white/90 dark:bg-slate-900/90 font-semibold shadow-xs">
              {item.type.toUpperCase()}
            </Badge>
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-md">
              {item.category}
            </span>
          </div>

          {/* Drag Handle (if active) */}
          {isDragEnabled && (
            <div
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white/90 cursor-grab active:cursor-grabbing backdrop-blur-md hover:bg-black/80 transition-colors"
              title="Drag to reorder card"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}

          {/* Rating or Read Time Badge */}
          {item.rating && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-xs shadow-md">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
          {!item.rating && item.readTime && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs backdrop-blur-md">
              <Clock className="w-3.5 h-3.5" />
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
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
            )}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {item.source.name}
            </span>
            {item.source.verified && (
              <span className="text-blue-500 font-bold" title="Verified source">
                ✓
              </span>
            )}
          </div>
          <span>{formatRelativeTime(item.publishedAt)}</span>
        </div>

        {/* Headline */}
        <h3
          onClick={() => onOpenModal(item)}
          className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors mb-2 leading-snug"
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 leading-relaxed flex-1">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Controls & Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
          {/* Like & Comments */}
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 hover:text-rose-500 transition-colors ${
                hasLiked ? "text-rose-500 font-medium" : ""
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
                <MessageSquare className="w-4 h-4" />
                <span>{formatNumber(item.metrics.comments)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons: Favorite, Share, CTA */}
          <div className="flex items-center gap-1.5">
            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={copied ? "Link copied!" : "Share article"}
              aria-label="Share article"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {/* Favorite / Bookmark */}
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-lg transition-colors ${
                isFavorited
                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/40"
                  : "text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
              title={isFavorited ? "Saved in favorites" : "Save to favorites"}
              aria-label="Bookmark item"
            >
              <Bookmark className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
            </button>

            {/* Call to action */}
            <button
              onClick={() => onOpenModal(item)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors focus:ring-2 focus:ring-blue-500"
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
