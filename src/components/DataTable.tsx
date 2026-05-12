"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState, useMemo, useCallback, memo } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchPlaceholder?: string;
  searchColumn?: string;
}

function DataTableInner<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
      globalFilter,
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  // Memoize callbacks to prevent unnecessary re-renders
  const handlePrevious = useCallback(() => table.previousPage(), [table]);
  const handleNext = useCallback(() => table.nextPage(), [table]);
  const handleFilterChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(event.target.value);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm group">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />

        <Input
          placeholder={searchPlaceholder}
          value={globalFilter ?? ""}
          onChange={handleFilterChange}
          className="
            h-11
            rounded-xl
            border
            border-border
            bg-background
            pl-10
            text-foreground
            shadow-sm
            transition-all

            focus:border-ring
            focus:ring-4
            focus:ring-ring/10

            dark:border-border
            dark:bg-input/30
            dark:text-foreground
            dark:placeholder:text-muted-foreground
          "
        />
      </div>

      {/* Table */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-sm

          dark:border-border
          dark:bg-card
        "
      >
        <div className="overflow-x-auto">
          <Table className="bg-background">
            {/* Header */}
            <TableHeader className="bg-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="
                    border-b
                    border-border
                    bg-background

                    dark:border-border
                    dark:bg-background
                  "
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="
                        h-14
                        px-6
                        text-xs
                        font-bold
                        uppercase
                        tracking-wider
                        text-muted-foreground

                        dark:text-muted-foreground
                      "
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Body */}
            <TableBody className="bg-background">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="
                      border-b
                      border-border
                      bg-background
                      transition-all

                      hover:bg-muted/50

                      dark:border-border
                      dark:bg-background
                      dark:hover:bg-muted/50
                    "
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="
                          px-6
                          py-4
                          text-sm
                          text-foreground

                          dark:text-foreground
                        "
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-background dark:bg-background">
                  <TableCell
                    colSpan={columns.length}
                    className="
                      h-32
                      text-center
                      text-sm
                      italic
                      text-muted-foreground

                      dark:text-muted-foreground
                    "
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-border
            bg-muted
            px-6
            py-4

            dark:border-border
            dark:bg-card
          "
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground dark:text-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>

            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Showing {table.getRowModel().rows.length} of{" "}
              {data.length} rows
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!table.getCanPreviousPage()}
              className="
                h-9
                w-9
                rounded-lg
                border
                border-border
                bg-background
                p-0
                text-foreground
                transition-all

                hover:bg-muted/50
                hover:text-foreground

                disabled:opacity-30

                dark:border-border
                dark:bg-input/30
                dark:text-foreground
                dark:hover:bg-muted/50
              "
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!table.getCanNextPage()}
              className="
                h-9
                w-9
                rounded-lg
                border
                border-border
                bg-background
                p-0
                text-foreground
                transition-all

                hover:bg-muted/50
                hover:text-foreground

                disabled:opacity-30

                dark:border-border
                dark:bg-input/30
                dark:text-foreground
                dark:hover:bg-muted/50
              "
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;