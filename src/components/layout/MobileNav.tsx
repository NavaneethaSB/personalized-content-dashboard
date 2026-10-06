"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  LayoutDashboard,
  Flame,
  Bookmark,
  BarChart2,
  Settings,
  Sparkles,
} from "lucide-react";
import { ActiveTab } from "@/types";
import { useAppSelector } from "@/store/hooks";
import { translations } from "@/lib/i18n";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  onOpenSettings,
}: MobileNavProps) {
  const favoriteCount = useAppSelector((state) => state.favorites.items.length);
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "feed", label: t.feed, icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "trending", label: t.trending, icon: <Flame className="w-5 h-5 text-amber-400" /> },
    { id: "favorites", label: t.favorites, icon: <Bookmark className="w-5 h-5 text-cyan-400" />, badge: favoriteCount },
    { id: "analytics", label: t.analytics, icon: <BarChart2 className="w-5 h-5 text-emerald-400" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-72 bg-white dark:bg-[#060913] border-r border-slate-200 dark:border-[#141e30] h-full p-5 flex flex-col z-10 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#141e30]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">PulseHub</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#121a2d]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav list */}
            <div className="py-4 space-y-1.5 flex-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent text-indigo-400 border-l-2 border-indigo-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#101726] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Settings button */}
            <button
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#101726] border-t border-slate-100 dark:border-[#141e30]"
            >
              <Settings className="w-5 h-5" />
              <span>{t.settings}</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
