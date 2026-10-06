import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-slate-800 rounded-md",
        className
      )}
    />
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <Skeleton className="w-full h-48 rounded-xl" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-5 rounded-full" />
        <Skeleton className="w-24 h-4 rounded-md" />
      </div>
      <Skeleton className="w-4/5 h-6 rounded-md" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-3/4 h-4 rounded-md" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
        <Skeleton className="w-28 h-4 rounded-md" />
        <Skeleton className="w-20 h-8 rounded-lg" />
      </div>
    </div>
  );
}
