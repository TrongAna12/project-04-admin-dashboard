"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { TrendingUp, CreditCard, Wallet } from "lucide-react";

const stats = [
  { label: "Monthly Recurring Revenue", value: "$182,500", icon: <TrendingUp className="h-4 w-4" /> },
  { label: "Outstanding invoices", value: "$34,200", icon: <CreditCard className="h-4 w-4" /> },
  { label: "Available cash", value: "$98,700", icon: <Wallet className="h-4 w-4" /> },
];

export default function FinancePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Finance"
        description="Track revenue, expenses, and forecast performance across the organisation."
        action={
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" size="sm">
            View ledger
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.label} className="border-slate-200 dark:border-slate-800">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                  {item.icon}
                </div>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Updated 2 hours ago</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Expense breakdown</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-3">
          {[
            { label: "Marketing", value: "$21,600", progress: "48%" },
            { label: "Operations", value: "$15,400", progress: "26%" },
            { label: "R&D", value: "$8,800", progress: "16%" },
          ].map((item) => (
            <div key={item.label} className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{item.value}</p>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-full rounded-full bg-blue-500" style={{ width: item.progress }} />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.progress} of monthly budget</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
