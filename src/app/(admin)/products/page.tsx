"use client";

import { useEffect, useState, useMemo } from "react";
import { getProductData } from "@/services/api";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Memoize columns to prevent unnecessary DataTable re-renders
  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <img
            src={row.original.image}
            alt={row.original.name}
            className="h-10 w-10 rounded bg-slate-100"
          />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock;
        const color = stock > 50 ? "text-green-600" : stock > 10 ? "text-yellow-600" : "text-red-600";
        return <span className={color}>{stock} units</span>;
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{row.original.rating}</span>
          <span className="text-slate-600 dark:text-slate-400">
            ({row.original.reviews})
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colors: Record<string, string> = {
          active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
          discontinued: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        };
        return (
          <Badge className={colors[status] || "bg-gray-100 text-gray-800"}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProductData(1, 100);
        setProducts(response.data);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
    {/* Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Sản phẩm
        </h1>
        <p className="font-medium text-slate-500 dark:text-slate-400">
          Quản lý danh mục hàng hóa và tồn kho.
        </p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-400/30 transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4 stroke-[3]" />
            Thêm sản phẩm
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Thêm sản phẩm mới
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên sản phẩm</label>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Nhập tên sản phẩm"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Giá bán</label>
              <input
                type="number"
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Danh mục</label>
              <select className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Accessories</option>
                <option>Home</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Lưu sản phẩm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    {/* Table Card - Ép màu nền tối ở đây */}
    <Card className="border-slate-200 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none overflow-hidden">
      {loading ? (
        <div className="flex h-80 flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800" />
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Đang tải danh sách sản phẩm...
          </span>
        </div>
      ) : (
        <div className="p-0"> {/* Bỏ padding p-6 để DataTable sát viền Card cho đẹp */}
          <DataTable 
            columns={columns} 
            data={products} 
            searchPlaceholder="Tìm tên sản phẩm, danh mục..." 
            searchColumn="name" // Thêm cái này để tìm kiếm hoạt động
          />
        </div>
      )}
    </Card>
  </div>
);
}