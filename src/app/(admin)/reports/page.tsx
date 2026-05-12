"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, Legend } from "recharts";

const reportData = [
  { month: "Jan", revenue: 120000, leads: 412, conversion: 32 },
  { month: "Feb", revenue: 150000, leads: 520, conversion: 35 },
  { month: "Mar", revenue: 135000, leads: 468, conversion: 31 },
  { month: "Apr", revenue: 170000, leads: 540, conversion: 36 },
  { month: "May", revenue: 189000, leads: 610, conversion: 39 },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Reports"
        description="Review business reports, performance summaries, and analytics exports."
        action={
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" size="sm">
            Export report
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={reportData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Insights</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={reportData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="leads" fill="#22c55e" radius={[8, 8, 0, 0]} />
                <Bar dataKey="conversion" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { label: "Total reports", value: "24", description: "Monthly exports" },
          { label: "Active insights", value: "13", description: "Saved dashboards" },
          { label: "Export speed", value: "2.4s", description: "Average generation" },
        ].map((item) => (
          <Card key={item.label} className="border-slate-200 dark:border-slate-800">
            <CardContent className="space-y-2">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{item.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
