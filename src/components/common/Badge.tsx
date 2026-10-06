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
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    primary: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    purple: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    outline: "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 rounded-md font-medium",
    md: "text-xs px-2.5 py-1 rounded-full font-medium tracking-wide",
  };

  return (
    <span className={cn("inline-flex items-center gap-1", variantStyles[variant], sizeStyles[size], className)}>
      {children}
    </span>
  );
}
