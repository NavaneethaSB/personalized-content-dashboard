"use client";

import React, { useState, useEffect, useRef } from "react";
import { Reorder, motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Inbox,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { ContentItem } from "@/types";
import { ContentCard } from "./ContentCard";
import { ContentCardSkeleton } from "@/components/common/Skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  reorderFeedItems,
  setCurrentPage,
  fetchDashboardFeed,
} from "@/store/slices/feedSlice";
import { translations } from "@/lib/i18n";

interface FeedListProps {
  onOpenArticle: (item: ContentItem) => void;
  isDragMode: boolean;
}

export function FeedList({ onOpenArticle, isDragMode }: FeedListProps) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.feed.filteredItems);
  const status = useAppSelector((state) => state.feed.status);
  const error = useAppSelector((state) => state.feed.error);
  const currentPage = useAppSelector((state) => state.feed.currentPage);
  const paginationMode = useAppSelector((state) => state.preferences.paginationMode);
  const itemsPerPage = useAppSelector((state) => state.preferences.itemsPerPage) || 6;
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  // Infinite scroll trigger ref
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [infiniteDisplayCount, setInfiniteDisplayCount] = useState<number>(itemsPerPage);

  // Reset infinite display count when filters or items change
  useEffect(() => {
    setInfiniteDisplayCount(itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (paginationMode !== "infinite") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && infiniteDisplayCount < items.length) {
          setInfiniteDisplayCount((prev) => Math.min(prev + itemsPerPage, items.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [paginationMode, infiniteDisplayCount, items.length, itemsPerPage]);

  // Pagination calculations
  const totalPages = Math.ceil(items.length / itemsPerPage) || 1;
  const paginatedItems =
    paginationMode === "pagination"
      ? items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : items.slice(0, infiniteDisplayCount);

  const handleReorder = (newOrder: ContentItem[]) => {
    dispatch(reorderFeedItems(newOrder));
  };

  // Loading state
  if (status === "loading" && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ContentCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (status === "failed" && items.length === 0) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-2xl">
        <h4 className="text-base font-semibold text-rose-700 dark:text-rose-400 mb-2">
          Unable to Load Content Stream
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => dispatch(fetchDashboardFeed())}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Empty state
  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-white dark:bg-[#0a0f1d] border border-dashed border-slate-300 dark:border-[#162238] rounded-3xl">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
          {t.noContentFound}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Try adjusting your search terms or expanding your preferred categories in Settings.
        </p>
      </div>
    );
  }

  const gridClass =
    viewMode === "list"
      ? "flex flex-col gap-4"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className="space-y-6">
      {isDragMode ? (
        /* Drag-and-Drop Reorder Mode */
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          className="space-y-4"
        >
          {items.map((item) => (
            <Reorder.Item
              key={item.id}
              value={item}
              className="cursor-grab active:cursor-grabbing"
              whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.4)" }}
            >
              <ContentCard
                item={item}
                onOpenModal={onOpenArticle}
                isDragEnabled={true}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        /* Standard Interactive Grid */
        <motion.div layout className={gridClass}>
          <AnimatePresence mode="popLayout">
            {paginatedItems.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onOpenModal={onOpenArticle}
                isDragEnabled={false}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Infinite Scroll Indicator & Trigger */}
      {paginationMode === "infinite" && !isDragMode && (
        <div ref={observerTarget} className="py-6 text-center">
          {infiniteDisplayCount < items.length ? (
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Loading more stories...</span>
            </div>
          ) : (
            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>You're all caught up with your personalized stream</span>
            </div>
          )}
        </div>
      )}

      {/* Standard Pagination Controls */}
      {paginationMode === "pagination" && !isDragMode && totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#141e30]">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.page} <span className="font-semibold text-slate-900 dark:text-slate-200">{currentPage}</span> {t.of}{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-200">{totalPages}</span> ({items.length} items)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#182640] dark:bg-[#0c1220] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#141d31] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page number indicators */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                // Show pages around current
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => dispatch(setCurrentPage(pageNum))}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                          : "text-slate-600 dark:text-slate-400 dark:bg-[#0c1220] dark:border dark:border-[#182640] hover:bg-slate-100 dark:hover:bg-[#141d31] hover:dark:text-slate-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return (
                    <span key={pageNum} className="text-slate-400 px-1 text-xs">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() => dispatch(setCurrentPage(Math.min(currentPage + 1, totalPages)))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#182640] dark:bg-[#0c1220] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#141d31] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
