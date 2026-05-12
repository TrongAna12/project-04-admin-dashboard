"use client";

import { useEffect, useState, useMemo } from "react";
import { getOrders } from "@/services/api";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Memoize columns to prevent unnecessary DataTable re-renders
  const columns = useMemo<ColumnDef<Order>[]>(() => [
    {
      accessorKey: "orderNumber",
      header: "Mã đơn hàng",
      cell: ({ row }) => {
        const id = String(row.original.id);
        return (
          <div className="flex flex-col">
            <span className="font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
              #{row.original.orderNumber}
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">
              ID: {id.substring(0, 8)}...
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {row.original.customerName}
          </span>
          <span className="text-xs text-slate-500">Khách hàng lẻ</span>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => (
        <span className="font-black text-slate-900 dark:text-white">
          {formatCurrency(row.original.totalAmount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Vận chuyển",
      cell: ({ row }) => {
        const status = row.original.status;
        const config: Record<
          string,
          { label: string; icon: any; color: string }
        > = {
          pending: {
            label: "Chờ duyệt",
            icon: Clock,
            color:
              "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
          },
          processing: {
            label: "Đang xử lý",
            icon: Package,
            color:
              "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
          },
          shipped: {
            label: "Đang giao",
            icon: Truck,
            color:
              "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
          },
          delivered: {
            label: "Thành công",
            icon: CheckCircle2,
            color:
              "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
          },
          cancelled: {
            label: "Đã hủy",
            icon: XCircle,
            color:
              "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
          },
        };

        const item = config[status] || config.pending;
        const Icon = item.icon;

        return (
          <Badge
            className={cn(
              "flex w-fit items-center gap-1 border-none px-2 py-0.5 text-[10px] font-bold uppercase",
              item.color,
            )}
          >
            <Icon className="h-3 w-3" />
            {item.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Thanh toán",
      cell: ({ row }) => {
        const status = row.original.paymentStatus;
        const config: Record<string, { label: string; color: string }> = {
          pending: { label: "Chờ thanh toán", color: "text-amber-500" },
          paid: { label: "Đã thanh toán", color: "text-emerald-500" },
          failed: { label: "Thất bại", color: "text-rose-500" },
          refunded: { label: "Đã hoàn tiền", color: "text-slate-500" },
        };
        const item = config[status] || config.pending;
        return (
          <div className="flex items-center gap-1.5 font-bold">
            <CreditCard className={cn("h-3.5 w-3.5", item.color)} />
            <span className={cn("text-xs", item.color)}>{item.label}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Ngày đặt",
      cell: ({ row }) => (
        <div className="text-xs font-medium text-slate-500">
          {formatDate(row.original.createdAt)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders(1, 100);
        setOrders(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Đơn hàng
          </h1>
          <p className="text-slate-500 font-medium">
            Theo dõi, cập nhật trạng thái và in hóa đơn khách hàng.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 shadow-sm"
          >
            Tải báo cáo
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                <Plus className="mr-2 h-4 w-4 stroke-[3]" />
                Tạo đơn mới
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Tạo đơn hàng thủ công
                </DialogTitle>
                <DialogDescription>
                  Sử dụng tính năng này khi khách đặt qua điện thoại hoặc tại
                  quầy.
                </DialogDescription>
              </DialogHeader>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
                <p className="text-sm font-medium text-slate-400">
                  Giao diện form đang được cập nhật...
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Table Content */}
      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 dark:bg-slate-950 shadow-xl shadow-slate-200/40 dark:shadow-none">
        {loading ? (
          <div className="flex h-80 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-blue-600 dark:bg-slate-800" />
            {/* ... */}
          </div>
        ) : (
          <div className="p-0 bg-transparent">
            <DataTable
              columns={columns}
              data={orders}
              searchPlaceholder="Tìm mã đơn, tên khách hàng..."
              searchColumn="customerName"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
