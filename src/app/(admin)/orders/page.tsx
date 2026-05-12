"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Package,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSaleOrderDetail, useSaleOrders } from "@/hooks/useSaleOrders";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type {
  SaleOrder,
  SaleOrderApproved,
  SaleOrderSortField,
  SortDirection,
} from "@/types";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const SORTABLE_COLUMNS = new Set<SaleOrderSortField>([
  "saleOrderId",
  "orderNumber",
  "orderDate",
  "shopCode",
  "customerId",
  "amount",
  "discount",
  "total",
  "approved",
  "priority",
]);

const APPROVAL_CONFIG: Record<
  "Y" | "N" | "pending",
  { label: string; icon: LucideIcon; color: string }
> = {
  Y: {
    label: "Approved",
    icon: CheckCircle2,
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  N: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
};

function getApprovalConfig(approved: SaleOrderApproved) {
  if (approved === "Y") return APPROVAL_CONFIG.Y;
  if (approved === "N") return APPROVAL_CONFIG.N;
  return APPROVAL_CONFIG.pending;
}

function nullableCurrency(value: number | null) {
  return value === null ? "-" : formatCurrency(value);
}

function nullableDate(value: string | null) {
  return value ? formatDate(value) : "-";
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">
        {value ?? "-"}
      </span>
    </div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [approved, setApproved] = useState<"all" | "Y" | "N">("all");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderDate", desc: true },
  ]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedSaleOrderId, setSelectedSaleOrderId] = useState<number | null>(
    null
  );

  const debouncedSearch = useDebouncedValue(search, 350);
  const activeSort = sorting[0];
  const sortBy: SaleOrderSortField =
    activeSort && SORTABLE_COLUMNS.has(activeSort.id as SaleOrderSortField)
      ? (activeSort.id as SaleOrderSortField)
      : "orderDate";
  const sortDirection: SortDirection =
    activeSort?.desc === false ? "asc" : "desc";

  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch || undefined,
      approved: approved === "all" ? undefined : approved,
      sortBy,
      sortDirection,
    }),
    [
      approved,
      debouncedSearch,
      pagination.pageIndex,
      pagination.pageSize,
      sortBy,
      sortDirection,
    ]
  );

  const { data, error, isError, isFetching, isLoading } =
    useSaleOrders(queryParams);
  const {
    data: selectedSaleOrder,
    isFetching: isDetailFetching,
    isError: isDetailError,
  } = useSaleOrderDetail(selectedSaleOrderId);

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load SALE_ORDER records.", {
        description:
          error instanceof Error
            ? error.message
            : "Check Oracle connectivity and API logs.",
      });
    }
  }, [error, isError]);

  useEffect(() => {
    if (isDetailError) {
      toast.error("Unable to load order detail.");
    }
  }, [isDetailError]);

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [approved, debouncedSearch]);

  const columns = useMemo<ColumnDef<SaleOrder>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-bold text-blue-600 dark:text-blue-400">
              #{row.original.orderNumber}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-400">
              ID: {row.original.saleOrderId}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "shopCode",
        header: "Shop",
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {row.original.shopCode ?? "-"}
            </span>
            <span className="text-xs text-slate-500">
              Customer: {row.original.customerId ?? "-"}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-black text-slate-900 dark:text-white">
            {nullableCurrency(row.original.total)}
          </span>
        ),
      },
      {
        accessorKey: "approved",
        header: "Approval",
        cell: ({ row }) => {
          const item = getApprovalConfig(row.original.approved);
          const Icon = item.icon;

          return (
            <Badge
              className={cn(
                "flex w-fit items-center gap-1 border-none px-2 py-0.5 text-[10px] font-bold uppercase",
                item.color
              )}
            >
              <Icon className="h-3 w-3" />
              {item.label}
            </Badge>
          );
        },
      },
      // {
      //   accessorKey: "orderType",
      //   header: "Type",
      //   cell: ({ row }) => (
      //     <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
      //       {row.original.orderType ?? "-"}
      //     </span>
      //   ),
      // },
      // {
      //   accessorKey: "orderSource",
      //   header: "Source",
      //   enableSorting: false,
      //   cell: ({ row }) => (
      //     <span className="text-xs font-medium text-slate-500">
      //       {row.original.orderSource ?? "-"}
      //     </span>
      //   ),
      // },
      {
        accessorKey: "orderDate",
        header: "Order Date",
        cell: ({ row }) => (
          <div className="text-xs font-medium text-slate-500">
            {nullableDate(row.original.orderDate)}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-slate-400 hover:text-blue-600"
              onClick={() => setSelectedSaleOrderId(row.original.saleOrderId)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.pages ?? -1,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const pageCount = data?.pages ?? 1;
  const totalRows = data?.total ?? 0;
  const visibleRows = table.getRowModel().rows;
  const isTableBusy = isLoading || isFetching;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            SALE_ORDER
          </h1>
          <p className="font-medium text-slate-500">
            Monitor Oracle ERP sale orders with server-side search, sorting, and
            pagination.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 shadow-sm"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4 stroke-[3]" />
                New order
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  Create sale order
                </DialogTitle>
                <DialogDescription>
                  Write operations should be enabled only after Oracle business
                  validations are confirmed.
                </DialogDescription>
              </DialogHeader>
              <div className="flex h-32 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm font-medium text-slate-400">
                  Create flow is intentionally read-only in this integration
                  pass.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="overflow-hidden border-slate-200 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
        <div className="space-y-4 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order, ref, shop, description..."
                className="h-10 pl-10"
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Select
                value={approved}
                onValueChange={(value) =>
                  setApproved(value as "all" | "Y" | "N")
                }
              >
                <SelectTrigger className="h-10 w-full sm:w-40">
                  <SelectValue placeholder="Approval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All approval</SelectItem>
                  <SelectItem value="Y">Approved</SelectItem>
                  <SelectItem value="N">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={String(pagination.pageSize)}
                onValueChange={(value) =>
                  setPagination({ pageIndex: 0, pageSize: Number(value) })
                }
              >
                <SelectTrigger className="h-10 w-full sm:w-32">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option} rows
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table className="bg-background">
                <TableHeader className="bg-muted">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-b border-border bg-background"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="h-14 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground"
                        >
                          {header.isPlaceholder ? null : (
                            <button
                              type="button"
                              disabled={!header.column.getCanSort()}
                              onClick={header.column.getToggleSortingHandler()}
                              className={cn(
                                "inline-flex items-center gap-1",
                                header.column.getCanSort() &&
                                  "cursor-pointer hover:text-foreground"
                              )}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: "↑",
                                desc: "↓",
                              }[header.column.getIsSorted() as string] ?? null}
                            </button>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody className="bg-background">
                  {isTableBusy ? (
                    Array.from({ length: Math.min(pagination.pageSize, 10) }).map(
                      (_, index) => (
                        <TableRow key={index} className="border-b border-border">
                          <TableCell colSpan={columns.length} className="px-6 py-4">
                            <div className="h-5 w-full animate-pulse rounded bg-muted" />
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : visibleRows.length ? (
                    visibleRows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="border-b border-border bg-background transition-all hover:bg-muted/50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-6 py-4 text-sm text-foreground"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : isError ? (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-40 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <AlertCircle className="h-5 w-5 text-rose-500" />
                          <span className="text-sm font-medium">
                            Oracle data is unavailable.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-40 text-center text-sm italic text-muted-foreground"
                      >
                        No SALE_ORDER records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 border-t border-border bg-muted px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:bg-card">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-foreground">
                  Page {pagination.pageIndex + 1} of {pageCount}
                </p>
                <p className="text-xs text-muted-foreground">
                  Showing {visibleRows.length} of {totalRows} rows
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage() || isTableBusy}
                  className="h-9 w-9 rounded-lg p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage() || isTableBusy}
                  className="h-9 w-9 rounded-lg p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        open={selectedSaleOrderId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedSaleOrderId(null);
        }}
      >
        <DialogContent className="rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Package className="h-5 w-5 text-blue-600" />
              Sale order detail
            </DialogTitle>
            <DialogDescription>
              Read-only Oracle SALE_ORDER detail loaded on demand.
            </DialogDescription>
          </DialogHeader>

          {isDetailFetching ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-6 animate-pulse rounded bg-muted" />
              ))}
            </div>
          ) : selectedSaleOrder ? (
            <div className="grid gap-x-6 sm:grid-cols-2">
              <DetailRow label="Order number" value={selectedSaleOrder.orderNumber} />
              <DetailRow label="Reference" value={selectedSaleOrder.refOrderNumber} />
              <DetailRow label="Shop" value={selectedSaleOrder.shopCode} />
              <DetailRow label="Customer ID" value={selectedSaleOrder.customerId} />
              <DetailRow label="Order date" value={nullableDate(selectedSaleOrder.orderDate)} />
              <DetailRow label="Delivery date" value={nullableDate(selectedSaleOrder.deliveryDate)} />
              <DetailRow label="Amount" value={nullableCurrency(selectedSaleOrder.amount)} />
              <DetailRow label="Discount" value={nullableCurrency(selectedSaleOrder.discount)} />
              <DetailRow label="Total" value={nullableCurrency(selectedSaleOrder.total)} />
              <DetailRow label="Weight" value={selectedSaleOrder.totalWeight} />
              <DetailRow label="Source" value={selectedSaleOrder.orderSource} />
              <DetailRow label="Description" value={selectedSaleOrder.description} />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              No detail available.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
