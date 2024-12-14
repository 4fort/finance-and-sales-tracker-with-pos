'use client'

import * as React from 'react'
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import DonutChart from '@/components/donut-charts'
import CustomBarChart from '@/components/charts'
import { ChartLine } from '@/components/chart-line-interactive'
const data: Customer[] = [
  {
    id: 'm5gr84i9',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'active',
    joinDate: '2023-01-15',
  },
  {
    id: '3u1reuv4',
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'inactive',
    joinDate: '2023-02-20',
  },
  {
    id: 'derv1ws0',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    status: 'active',
    joinDate: '2023-03-10',
  },
  {
    id: '5kma53ae',
    name: 'Diana Ross',
    email: 'diana@example.com',
    status: 'active',
    joinDate: '2023-04-05',
  },
  {
    id: 'bhqecj4p',
    name: 'Edward Norton',
    email: 'edward@example.com',
    status: 'inactive',
    joinDate: '2023-05-12',
  },
]

export type Customer = {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  joinDate: string
}

export const columns: ColumnDef<Customer>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <div className="capitalize">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue('status')}</div>
    ),
  },
  {
    accessorKey: 'joinDate',
    header: 'Join Date',
    cell: ({ row }) => <div>{row.getValue('joinDate')}</div>,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(customer.id)}>
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const CustomersPage = () => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 ">
      <div className="w-full flex  justify-between space-x-4">
        <div className="w-full">
          <ChartLine />
        </div>
        <DonutChart />
      </div>
      <div className="w-full">
        <div className="flex items-center pb-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
            onChange={event =>
              table.getColumn('email')?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border bg-white p-3">
          <Table className="">
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CustomersPage
