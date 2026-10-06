import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "purple" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:border dark:border-slate-700/60",
    primary: "bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30 dark:shadow-[0_0_12px_rgba(6,182,212,0.15)]",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30 dark:shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    purple: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30 dark:shadow-[0_0_12px_rgba(168,85,247,0.15)]",
    outline: "border border-slate-300 text-slate-600 dark:border-slate-800 dark:text-slate-400 dark:bg-slate-900/40",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase",
    md: "text-xs px-2.5 py-1 rounded-full font-semibold tracking-wide",
  };

  return (
    <span className={cn("inline-flex items-center gap-1 backdrop-blur-xs", variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
