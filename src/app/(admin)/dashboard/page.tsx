"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/widgets/StatCard";
import {
  StatCardSkeleton,
  ChartSkeleton,
} from "@/components/widgets/SkeletonLoaders";
import {
  getDashboardStats,
  getRevenueData,
  getTopProducts,
} from "@/services/api";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber, cn } from "@/lib/utils";
import type { DashboardStats, RevenueData, TopProduct } from "@/types";
import {
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  Calendar,
} from "lucide-react";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const results = await Promise.allSettled([
          getDashboardStats(),
          getRevenueData(),
          getTopProducts(),
        ]);

        if (results[0].status === "fulfilled") setStats(results[0].value);
        if (results[1].status === "fulfilled") setRevenueData(results[1].value);
        if (results[2].status === "fulfilled") setTopProducts(results[2].value);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header - Tối ưu khoảng cách và typography */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Chào mừng quay trở lại! Đây là tổng quan hiệu suất của bạn.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Calendar className="ml-2 h-4 w-4 text-slate-400" />
          <span className="px-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            Hôm nay: {new Date().toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>

      {/* Stats Grid - Tăng khoảng cách gap */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </>
        ) : stats ? (
          <>
            <StatCard
              title="Tổng doanh thu"
              value={formatCurrency(stats.totalRevenue)}
              description="Trong 30 ngày qua"
              trend={stats.revenueGrowth}
              icon={<TrendingUp className="h-5 w-5" />}
              variant="success"
            />
            <StatCard
              title="Tổng đơn hàng"
              value={formatNumber(stats.totalOrders)}
              description="Đã thanh toán"
              trend={stats.ordersGrowth}
              icon={<ShoppingCart className="h-5 w-5" />}
              variant="default"
            />
            <StatCard
              title="Khách hàng"
              value={formatNumber(stats.totalCustomers)}
              description="Khách hàng đang hoạt động"
              trend={stats.customersGrowth}
              icon={<Users className="h-5 w-5" />}
              variant="warning"
            />
            <StatCard
              title="Sản phẩm"
              value={formatNumber(stats.totalProducts)}
              description="Đang kinh doanh"
              trend={stats.productsGrowth}
              icon={<Package className="h-5 w-5" />}
              variant="danger"
            />
          </>
        ) : null}
      </div>

      {/* Charts Row - Nâng cấp từ Line sang Area cho xịn hơn */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Biểu đồ doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    opacity={0.05}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      backgroundColor: "#1e293b",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Products - Tối ưu thanh Progress */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Sản phẩm bán chạy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton />
            ) : (
              <div className="space-y-6">
                {topProducts.map((product) => (
                  <div key={product.id} className="group space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                          {product.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                        {product.sales} sales
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000"
                        style={{
                          width: `${(product.sales / Math.max(...topProducts.map((p) => p.sales))) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3 - Pie và Bar chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm dark:border-slate-950">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Trạng thái đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {loading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Thành công", value: 250 },
                      { name: "Đang giao", value: 180 },
                      { name: "Đang xử lý", value: 120 },
                      { name: "Chờ duyệt", value: 90 },
                      { name: "Đã hủy", value: 40 },
                    ]}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold">
              Hoạt động khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <ChartSkeleton />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { day: "T2", customers: 120, orders: 89 },
                    { day: "T3", customers: 145, orders: 110 },
                    { day: "T4", customers: 132, orders: 98 },
                    { day: "T5", customers: 178, orders: 145 },
                    { day: "T6", customers: 190, orders: 168 },
                    { day: "T7", customers: 165, orders: 140 },
                    { day: "CN", customers: 140, orders: 115 },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    opacity={0.1}
                  />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "transparent" }} />
                  <Bar
                    dataKey="customers"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
