"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/DataTable";
import { SectionHeader } from "@/components/common/SectionHeader";
import { getEmployees } from "@/services/api";
import type { Employee } from "@/types";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function EmployeesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployees(1, 100),
    staleTime: 1000 * 60 * 5,
  });

  // Memoize columns to prevent unnecessary DataTable re-renders
  const columns = useMemo<ColumnDef<Employee>[]>(() => [
    {
      accessorKey: "name",
      header: "Employee",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-900 dark:text-slate-100">{row.original.name}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{row.original.role}</span>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "phone",
      header: "Contact",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const enabled = row.original.status === "active";
        return (
          <Badge className={enabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}>
            {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" className="h-9 w-9 text-slate-500 hover:text-blue-600">
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-500 hover:text-rose-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], []);
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionHeader
        title="Employees"
        description="Manage your team, job titles, and access roles."
        action={
          <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New employee
          </Button>
        }
      />

      <Card className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
        {isLoading ? (
          <div className="flex h-80 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800" />
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading employees...</span>
          </div>
        ) : (
          <div className="p-0">
            <DataTable
              columns={columns}
              data={data?.data ?? []}
              searchPlaceholder="Search team members..."
              searchColumn="name"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
