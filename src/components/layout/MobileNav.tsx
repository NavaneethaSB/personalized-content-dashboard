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
  Radio,
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
    { id: "trending", label: t.trending, icon: <Flame className="w-5 h-5 text-amber-500" /> },
    { id: "favorites", label: t.favorites, icon: <Bookmark className="w-5 h-5 text-blue-500" />, badge: favoriteCount },
    { id: "analytics", label: t.analytics, icon: <BarChart2 className="w-5 h-5 text-emerald-500" /> },
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
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full p-5 flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 dark:text-white">PulseHub</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
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
                        ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
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
              className="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800"
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
