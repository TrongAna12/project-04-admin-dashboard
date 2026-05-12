import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthFormShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthFormShell({
  title,
  description,
  children,
  footer,
  className,
}: AuthFormShellProps) {
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4", className)}>
      <Card className="w-full max-w-md border-0 bg-white/95 shadow-2xl shadow-slate-900/20 backdrop-blur-xl dark:bg-slate-950/95">
        <CardHeader className="space-y-2 text-center px-8 pt-10">
          <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Admin
            </span>
            <span>LTE</span>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-10 pt-6">
          {children}
          {footer ? <div className="mt-6">{footer}</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}
