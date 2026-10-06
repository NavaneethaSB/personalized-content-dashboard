import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-[#121a2d] rounded-md",
        className
      )}
    />
  );
}

export function ContentCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#0a0f1d] border border-slate-200 dark:border-[#152033] rounded-2xl p-5 shadow-xs space-y-4">
      <Skeleton className="w-full h-48 rounded-xl dark:bg-[#0f172a]" />
      <div className="flex items-center gap-2">
        <Skeleton className="w-16 h-5 rounded-full dark:bg-[#152038]" />
        <Skeleton className="w-24 h-4 rounded-md dark:bg-[#152038]" />
      </div>
      <Skeleton className="w-4/5 h-6 rounded-md dark:bg-[#152038]" />
      <div className="space-y-2">
        <Skeleton className="w-full h-4 rounded-md dark:bg-[#152038]" />
        <Skeleton className="w-3/4 h-4 rounded-md dark:bg-[#152038]" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-[#152033]">
        <Skeleton className="w-28 h-4 rounded-md dark:bg-[#152038]" />
        <Skeleton className="w-20 h-8 rounded-lg dark:bg-[#152038]" />
      </div>
    </div>
  );
}
