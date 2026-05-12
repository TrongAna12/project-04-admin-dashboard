"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import CountUp from "react-countup";
import { memo } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

function StatCardInner({
  title,
  value,
  description,
  trend,
  icon,
  variant = "default",
}: StatCardProps) {
  const variants = {
    default:
      "border-blue-100 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-950/30",
    success:
      "border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/30",
    warning:
      "border-amber-100 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/30",
    danger:
      "border-rose-100 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-950/30",
  };

  const accentColors = {
    default: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    success: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    warning: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    danger: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        variants[variant]
      )}
    >
      {/* Decorative element */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-2xl transition-all group-hover:bg-white/40" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </CardTitle>
        {icon && (
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:rotate-12",
            accentColors[variant]
          )}>
            {icon}
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {typeof value === "number" ? (
              <CountUp end={value} duration={2} separator="," />
            ) : (
              value
            )}
          </div>

          {(description || trend !== undefined) && (
            <div className="flex items-center gap-2 text-xs font-medium">
              {trend !== undefined && (
                <div className={cn(
                  "flex items-center gap-1 rounded-full px-2 py-0.5",
                  trend >= 0 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" 
                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                )}>
                  {trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{trend >= 0 ? `+${trend}` : trend}%</span>
                </div>
              )}
              {description && (
                <span className="text-slate-500 dark:text-slate-400 italic">
                  {description}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const StatCard = memo(StatCardInner);