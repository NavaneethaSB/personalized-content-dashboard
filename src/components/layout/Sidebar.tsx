"use client";

import React from "react";
import {
  LayoutDashboard,
  Flame,
  Bookmark,
  BarChart2,
  Settings,
  Sparkles,
  Layers,
  ChevronLeft,
  ChevronRight,
  Radio,
} from "lucide-react";
import { ActiveTab } from "@/types";
import { useAppSelector } from "@/store/hooks";
import { translations } from "@/lib/i18n";

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  onOpenSettings,
}: SidebarProps) {
  const favoriteCount = useAppSelector((state) => state.favorites.items.length);
  const language = useAppSelector((state) => state.preferences.language);
  const t = translations[language] || translations.en;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: "feed",
      label: t.feed,
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "trending",
      label: t.trending,
      icon: <Flame className="w-5 h-5 text-amber-500" />,
    },
    {
      id: "favorites",
      label: t.favorites,
      icon: <Bookmark className="w-5 h-5 text-blue-500" />,
      badge: favoriteCount,
    },
    {
      id: "analytics",
      label: t.analytics,
      icon: <BarChart2 className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <aside
      className={`relative hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-base font-bold text-slate-900 dark:text-white leading-none">
                {t.appName}
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                {t.tagline}
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/50 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {item.badge !== undefined && item.badge > 0 && !isCollapsed && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live stream badge */}
      {!isCollapsed && (
        <div className="px-4 py-3 mx-3 mb-2 rounded-2xl bg-linear-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>SSE Stream Live</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-source pipeline connected.
          </p>
        </div>
      )}

      {/* Settings Footer */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
          title={isCollapsed ? t.settings : undefined}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>{t.settings}</span>}
        </button>
      </div>
    </aside>
  );
}
