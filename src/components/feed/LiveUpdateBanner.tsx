"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, ArrowUpCircle } from "lucide-react";

interface LiveUpdateBannerProps {
  incomingCount: number;
  onApplyUpdates: () => void;
  isStreamActive: boolean;
}

export function LiveUpdateBanner({
  incomingCount,
  onApplyUpdates,
}: LiveUpdateBannerProps) {
  return (
    <div className="mb-4">
      {/* Live stream status indicator */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-[#06141a] border border-emerald-500/20 dark:border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 mb-2.5 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold">Live Real-Time Stream Active</span>
        </div>
        <span className="text-[11px] opacity-80 font-medium">Listening for breaking updates...</span>
      </div>

      {/* New updates incoming pill */}
      <AnimatePresence>
        {incomingCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-xl shadow-indigo-600/30 border border-indigo-400/30 cursor-pointer hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-[0.99]"
            onClick={onApplyUpdates}
          >
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 animate-pulse text-cyan-300" />
              <span className="text-xs sm:text-sm font-bold">
                {incomingCount} new breaking {incomingCount === 1 ? "story" : "stories"} arrived
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-xl backdrop-blur-xs transition-colors">
              <span>Show New Posts</span>
              <ArrowUpCircle className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
