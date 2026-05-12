"use client";

import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types";
import type { ProductSortDirection, ProductSortField } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useProducts } from "@/hooks/useProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const SORTABLE_COLUMNS = new Set<ProductSortField>([
  "productId",
  "productCode",
  "productName",
  "price",
  "stockQuantity",
]);

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState<SortingState>([
    { id: "productId", desc: true },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const debouncedSearch = useDebouncedValue(search, 350);
  const activeSort = sorting[0];
  const sortBy: ProductSortField =
    activeSort && SORTABLE_COLUMNS.has(activeSort.id as ProductSortField)
      ? (activeSort.id as ProductSortField)
      : "productId";
  const sortDirection: ProductSortDirection =
    activeSort?.desc === false ? "asc" : "desc";

  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      search: debouncedSearch || undefined,
      sortBy,
      sortDirection,
    }),
    [
      debouncedSearch,
      pagination.pageIndex,
      pagination.pageSize,
      sortBy,
      sortDirection,
    ],
  );

  const { data, error, isError, isFetching, isLoading } =
    useProducts(queryParams);

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load PRODUCT records.", {
        description:
          error instanceof Error
            ? error.message
            : "Check Oracle connectivity and API logs.",
      });
    }
  }, [error, isError]);

  useEffect(() => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
  }, [debouncedSearch]);

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.image ?? "/file.svg"}
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
        enableSorting: false,
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
        accessorKey: "stockQuantity",
        header: "Stock",
        cell: ({ row }) => {
          const stock = row.original.stock;
          const color =
            stock > 50
              ? "text-green-600"
              : stock > 10
                ? "text-yellow-600"
                : "text-red-600";
          return <span className={color}>{stock} units</span>;
        },
      },
      {
        accessorKey: "rating",
        header: "Rating",
        enableSorting: false,
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
        enableSorting: false,
        cell: ({ row }) => {
          const status = row.original.status;
          const colors: Record<string, string> = {
            active:
              "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            inactive:
              "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
            discontinued:
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
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
        enableSorting: false,
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
    ],
    [],
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
            Products
          </h1>
          <p className="font-medium text-slate-500 dark:text-slate-400">
            Manager and monitor your product catalog with real-time Oracle data.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-400/30 transition-all active:scale-95">
              <Plus className="mr-2 h-4 w-4 stroke-[3]" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl border-border bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Add New Product
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  Product Name
                </label>
                <input
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  Selling Price
                </label>
                <input
                  type="number"
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  Category
                </label>
                <select className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Accessories</option>
                  <option>Home</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Save Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-slate-200 shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-950 dark:shadow-none overflow-hidden">
        {isLoading ? (
          <div className="flex h-80 flex-col items-center justify-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-800" />
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Loading product list...
            </span>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm group w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Search product name, category..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-11 rounded-xl border border-border bg-background pl-10 text-foreground shadow-sm transition-all focus:border-ring focus:ring-4 focus:ring-ring/10 dark:border-border dark:bg-input/30 dark:text-foreground dark:placeholder:text-muted-foreground"
                />
              </div>

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

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm dark:border-border dark:bg-card">
              <div className="overflow-x-auto">
                <Table className="bg-background">
                  <TableHeader className="bg-muted">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border-b border-border bg-background dark:border-border dark:bg-background"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="h-14 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground"
                          >
                            {header.isPlaceholder ? null : (
                              <button
                                type="button"
                                disabled={!header.column.getCanSort()}
                                onClick={header.column.getToggleSortingHandler()}
                                className="inline-flex items-center gap-1 disabled:cursor-default"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                                {{
                                  asc: "asc",
                                  desc: "desc",
                                }[header.column.getIsSorted() as string] ??
                                  null}
                              </button>
                            )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody className="bg-background">
                    {isTableBusy ? (
                      Array.from({
                        length: Math.min(pagination.pageSize, 10),
                      }).map((_, index) => (
                        <TableRow
                          key={index}
                          className="border-b border-border"
                        >
                          <TableCell
                            colSpan={columns.length}
                            className="px-6 py-4"
                          >
                            <div className="h-5 w-full animate-pulse rounded bg-muted" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : visibleRows.length ? (
                      visibleRows.map((row) => (
                        <TableRow
                          key={row.id}
                          className="border-b border-border bg-background transition-all hover:bg-muted/50 dark:border-border dark:bg-background dark:hover:bg-muted/50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="px-6 py-4 text-sm text-foreground dark:text-foreground"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : isError ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-40 text-center"
                        >
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <AlertCircle className="h-5 w-5 text-rose-500" />
                            <span className="text-sm font-medium">
                              Oracle product data is unavailable.
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow className="bg-background dark:bg-background">
                        <TableCell
                          colSpan={columns.length}
                          className="h-32 text-center text-sm italic text-muted-foreground dark:text-muted-foreground"
                        >
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between border-t border-border bg-muted px-6 py-4 dark:border-border dark:bg-card">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-foreground dark:text-foreground">
                    Page {pagination.pageIndex + 1} of {pageCount}
                  </p>

                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    Showing {visibleRows.length} of {totalRows} rows
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage() || isTableBusy}
                    className="h-9 w-9 rounded-lg border border-border bg-background p-0 text-foreground transition-all hover:bg-muted/50 hover:text-foreground disabled:opacity-30 dark:border-border dark:bg-input/30 dark:text-foreground dark:hover:bg-muted/50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage() || isTableBusy}
                    className="h-9 w-9 rounded-lg border border-border bg-background p-0 text-foreground transition-all hover:bg-muted/50 hover:text-foreground disabled:opacity-30 dark:border-border dark:bg-input/30 dark:text-foreground dark:hover:bg-muted/50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
