"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { FilterBar } from "@/components/feed/FilterBar";
import { FeedList } from "@/components/feed/FeedList";
import { LiveUpdateBanner } from "@/components/feed/LiveUpdateBanner";
import { ArticleModal } from "@/components/feed/ArticleModal";
import { TrendingSection } from "@/components/trending/TrendingSection";
import { FavoritesSection } from "@/components/favorites/FavoritesSection";
import { AnalyticsSection } from "@/components/analytics/AnalyticsSection";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchDashboardFeed,
  prependLiveItem,
} from "@/store/slices/feedSlice";
import { useLiveStream } from "@/hooks/useLiveStream";
import { ActiveTab, ContentItem } from "@/types";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<ActiveTab>("feed");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<ContentItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const autoRefresh = useAppSelector((state) => state.preferences.autoRefresh);
  const refreshInterval = useAppSelector((state) => state.preferences.refreshInterval) || 30;

  // Initialize unified feed on mount
  useEffect(() => {
    dispatch(fetchDashboardFeed());
  }, [dispatch]);

  // Periodic polling / auto-refresh when enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      dispatch(fetchDashboardFeed());
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, dispatch]);

  // Real-time SSE Live Stream hook
  const { isConnected, incomingItems, clearIncoming } = useLiveStream({
    enabled: true,
  });

  const handleApplyLiveUpdates = () => {
    incomingItems.forEach((item) => {
      dispatch(prependLiveItem(item));
    });
    clearIncoming();
  };

  return (
    <div className="relative flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
      {/* Ambient background glows for ultra-premium dark aesthetic */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-500/[0.07] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/10 dark:bg-purple-500/[0.05] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[350px] h-[350px] bg-cyan-600/10 dark:bg-cyan-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      {/* Collapsible Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative z-10">
        {/* Header Bar */}
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onToggleMobileMenu={() => setIsMobileNavOpen((prev) => !prev)}
        />

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {/* Live stream notification banner */}
          <LiveUpdateBanner
            incomingCount={incomingItems.length}
            onApplyUpdates={handleApplyLiveUpdates}
            isStreamActive={isConnected}
          />

          {/* Tab Views */}
          <AnimatePresence mode="wait">
            {activeTab === "feed" && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <FilterBar
                  isDragMode={isDragMode}
                  onToggleDragMode={() => setIsDragMode((prev) => !prev)}
                />
                <FeedList
                  onOpenArticle={(item) => setSelectedArticle(item)}
                  isDragMode={isDragMode}
                />
              </motion.div>
            )}

            {activeTab === "trending" && (
              <motion.div
                key="trending"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingSection
                  onOpenArticle={(item) => setSelectedArticle(item)}
                />
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <FavoritesSection
                  onOpenArticle={(item) => setSelectedArticle(item)}
                />
              </motion.div>
            )}

            {activeTab === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <AnalyticsSection />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modals */}
      <ArticleModal
        item={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
