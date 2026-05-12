"use client";

import { useEffect, useState, useMemo } from "react";
import { getUsers } from "@/services/api";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/types";
import { formatDate, cn } from "@/lib/utils";
import { Plus, Edit2, Trash2, Mail, Building2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Memoize columns to prevent DataTable re-renders
  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: "name",
      header: "Người dùng",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-800">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs uppercase">
                {user.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Mail className="h-3 w-3" /> {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => {
        const role = row.original.role;
        const variants: Record<string, string> = {
          admin:
            "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
          moderator:
            "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
          user: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        };
        return (
          <Badge
            className={cn(
              "rounded-lg border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-wider",
              variants[role] || "bg-slate-100 text-slate-600",
            )}
          >
            <Shield className="mr-1 h-3 w-3" /> {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusConfig: Record<string, { class: string; label: string }> = {
          active: { class: "bg-emerald-500", label: "Hoạt động" },
          inactive: { class: "bg-slate-400", label: "Ngoại tuyến" },
          suspended: { class: "bg-rose-500", label: "Bị khóa" },
        };
        const config = statusConfig[status] || statusConfig.inactive;
        return (
          <div className="flex items-center gap-2">
            <div
              className={cn("h-2 w-2 rounded-full animate-pulse", config.class)}
            />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "department",
      header: "Phòng ban",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <Building2 className="h-3.5 w-3.5" />
          <span className="text-sm">{row.original.department}</span>
        </div>
      ),
    },
    {
      accessorKey: "lastLogin",
      header: "Truy cập cuối",
      cell: ({ row }) => (
        <span className="text-xs font-medium text-slate-500">
          {row.original.lastLogin
            ? formatDate(row.original.lastLogin)
            : "Chưa có dữ liệu"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: () => (
        <div className="flex justify-end gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ], []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers(1, 100);
        setUsers(response.data);
      } catch (err) {
        console.error("Lỗi lấy danh sách user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header tinh gọn */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Thành viên
          </h1>
          <p className="text-slate-500 font-medium">
            Quản lý danh sách người dùng và phân quyền hệ thống.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4 stroke-[3]" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Thêm thành viên mới
              </DialogTitle>
              <DialogDescription>
                Điền thông tin cơ bản để tạo tài khoản mới cho hệ thống.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="rounded-lg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@congty.com"
                  className="rounded-lg"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Xác nhận tạo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Card */}
      <Card className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:shadow-none">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-sm font-medium text-slate-500">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <div className="p-0">
            {" "}
            {/* DataTable đã có padding bên trong */}
            <DataTable
              columns={columns}
              data={users}
              searchPlaceholder="Tìm tên, email hoặc phòng ban..."
              searchColumn="name"
            />
          </div>
        )}
      </Card>
    </div>
  );
}
