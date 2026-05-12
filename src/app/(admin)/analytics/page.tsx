"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/widgets/StatCard";

export default function AnalyticsPage() {
  const analyticsData = [
    { month: "Jan", visits: 4000, conversions: 240, revenue: 2400 },
    { month: "Feb", visits: 3000, conversions: 221, revenue: 2210 },
    { month: "Mar", visits: 2000, conversions: 229, revenue: 2290 },
    { month: "Apr", visits: 2780, conversions: 200, revenue: 2000 },
    { month: "May", visits: 1890, conversions: 221, revenue: 2100 },
    { month: "Jun", visits: 2390, conversions: 229, revenue: 2100 },
    { month: "Jul", visits: 3490, conversions: 200, revenue: 2100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Detailed performance metrics and insights
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Visits"
          value="24.5K"
          trend={12}
          description="vs last month"
        />
        <StatCard
          title="Conversion Rate"
          value="3.2%"
          trend={5}
          description="vs last month"
        />
        <StatCard
          title="Avg. Session"
          value="5m 32s"
          trend={-2}
          description="vs last month"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Site Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="visits" fill="#3B82F6" />
                <Bar dataKey="conversions" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { page: "/dashboard", views: 4521, avgTime: "4m 32s", bounceRate: "24%" },
              { page: "/products", views: 3421, avgTime: "3m 45s", bounceRate: "32%" },
              { page: "/orders", views: 2842, avgTime: "2m 18s", bounceRate: "18%" },
              { page: "/analytics", views: 1923, avgTime: "5m 12s", bounceRate: "15%" },
            ].map((item) => (
              <div key={item.page} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div>
                  <p className="font-medium">{item.page}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.views} views • Avg: {item.avgTime}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Bounce</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {item.bounceRate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
