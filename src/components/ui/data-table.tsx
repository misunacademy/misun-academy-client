import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { useState, type ReactNode } from "react"

interface DataTablePagination {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  getRowId?: (row: TData) => string
  heading?: string
  subheading?: string
  filters?: ReactNode
  actions?: ReactNode
  isLoading?: boolean
  isFetching?: boolean
  emptyState?: ReactNode
  pagination?: DataTablePagination
}

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  heading,
  subheading,
  filters,
  actions,
  isLoading = false,
  isFetching = false,
  emptyState = "No data found.",
  pagination,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const showLoading = isLoading || isFetching

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: { sorting },
    onSortingChange: setSorting,
    manualPagination: true,
  })

  const columnCount = columns.length

  const renderTable = () => (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="py-8 text-center text-sm text-muted-foreground">
              Loading...
            </TableCell>
          </TableRow>
        ) : table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columnCount} className="py-8 text-center text-sm text-muted-foreground">
              {emptyState}
            </TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )

  const renderPagination = () => {
    if (!pagination) return null
    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="px-2 text-sm">Page {pagination.page} of {pagination.totalPages}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onPageChange(Math.min(pagination.totalPages, pagination.page + 1))}
            disabled={pagination.page >= pagination.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const tableSection = (
    <>
      {renderTable()}
      {renderPagination()}
    </>
  )

  if (heading || subheading || actions) {
    return (
      <>
        {filters && <div className="mb-6 flex flex-wrap items-center gap-4 w-full">{filters}</div>}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                {heading && (
                  <CardTitle className="flex items-center">
                    {heading}
                    {showLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                  </CardTitle>
                )}
                {subheading && <CardDescription>{subheading}</CardDescription>}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </CardHeader>
          <CardContent>{tableSection}
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      {filters && <div className="mb-6 flex flex-wrap items-center gap-4 w-full">{filters}</div>}
      {tableSection}
    </>
  )
}
