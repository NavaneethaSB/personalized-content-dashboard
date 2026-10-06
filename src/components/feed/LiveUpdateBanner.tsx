"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ArrowUpCircle } from "lucide-react";
import { ContentItem } from "@/types";

interface LiveUpdateBannerProps {
  incomingCount: number;
  onApplyUpdates: () => void;
  isStreamActive: boolean;
}

export function LiveUpdateBanner({
  incomingCount,
  onApplyUpdates,
  isStreamActive,
}: LiveUpdateBannerProps) {
  return (
    <div className="mb-4">
      {/* Live stream status indicator */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold">Live Real-Time Stream Active</span>
        </div>
        <span className="text-[11px] opacity-80">Listening for breaking updates...</span>
      </div>

      {/* New updates incoming pill */}
      <AnimatePresence>
        {incomingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="flex items-center justify-between p-3 rounded-xl bg-blue-600 text-white shadow-lg cursor-pointer hover:bg-blue-700 transition-colors"
            onClick={onApplyUpdates}
          >
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold">
                {incomingCount} new breaking {incomingCount === 1 ? "story" : "stories"} arrived
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg backdrop-blur-xs transition-colors">
              <span>Show New Posts</span>
              <ArrowUpCircle className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
