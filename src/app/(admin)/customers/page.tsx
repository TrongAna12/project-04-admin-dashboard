"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { SectionHeader } from "@/components/common/SectionHeader";
import { getCustomers } from "@/services/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Customer } from "@/types";
import { Plus, Eye, Trash2 } from "lucide-react";

export default function CustomersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => getCustomers(1, 100),
    staleTime: 1000 * 60 * 5,
  });

  // Memoize columns to prevent unnecessary DataTable re-renders
  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {row.original.name}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {row.original.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
    },
    {
      accessorKey: "totalOrders",
      header: "Orders",
      cell: ({ row }) => (
        <span className="font-semibold">{row.original.totalOrders}</span>
      ),
    },
    {
      accessorKey: "totalSpent",
      header: "Spent",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {formatCurrency(row.original.totalSpent)}
        </span>
      ),
    },
    {
      accessorKey: "lastOrderDate",
      header: "Last Order",
      cell: ({ row }) => (
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {row.original.lastOrderDate
            ? formatDate(row.original.lastOrderDate)
            : "--"}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const active = row.original.status === "active";
        return (
          <Badge
            className={
              active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            }
          >
            {row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-500 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-slate-500 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Customers"
        description="Manage customer accounts, relationship history, and lifetime value."
        action={
          <Button
            className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add customer
          </Button>
        }
      />

      <Card className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
        {isLoading ? (
          <div className="flex h-80 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Loading customers...
            </span>
          </div>
        ) : (
          <div className="p-0">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              searchPlaceholder="Search customer name, email or company..."
              searchColumn="name"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
