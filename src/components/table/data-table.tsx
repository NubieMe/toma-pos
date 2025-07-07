/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material'
import React from 'react'
import EnhancedTableToolbar from './toolbar'
import { visuallyHidden } from '@mui/utils'
import { TableColumn } from '@/types/column'
import RowActions from './actions'
import TablePaginationActions from './pagination-actions'

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1
  if (b[orderBy] > a[orderBy]) return 1
  return 0
}

function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
) {
  return order === 'desc'
    ? (a: Record<Key, any>, b: Record<Key, any>) => descendingComparator(a, b, orderBy)
    : (a: Record<Key, any>, b: Record<Key, any>) => -descendingComparator(a, b, orderBy)
}

interface DataTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[]
  rows: T[]
  rowIdKey?: keyof T
  title?: string
  actions?: React.ReactNode
  getRowActions?: (row: T) => ('edit' | 'view' | 'delete')[]
  onActionClick?: (action: 'edit' | 'view' | 'delete', row: T) => void
  loading: boolean
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  rowIdKey = 'id',
  title,
  actions,
  getRowActions,
  onActionClick,
  loading,
}: DataTableProps<T>) {
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof T>(columns[0].key)
  const [selected, setSelected] = React.useState<readonly (string | number)[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row[rowIdKey])
      setSelected(newSelected)
    } else {
      setSelected([])
    }
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string | number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly (string | number)[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else {
      newSelected = selected.filter((s) => s !== id)
    }

    setSelected(newSelected)
  }

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  )

  const isSelected = (id: string | number) => selected.includes(id)

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} title={title} actions={actions} />
        <TableContainer>
          <table aria-labelledby="tableTitle" style={{ width: '100%', minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
                {columns.map((col) => (
                  <TableCell
                    key={String(col.key)}
                    align={col.numeric ? 'right' : 'left'}
                    padding={col.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === col.key ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : 'asc'}
                      onClick={(e) => handleRequestSort(e, col.key)}
                    >
                      {col.label}
                      {orderBy === col.key && (
                        <Box component="span" sx={visuallyHidden}>
                          {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {getRowActions &&
                  <TableCell align="right">
                    <TableSortLabel disabled>
                      Action
                    </TableSortLabel>
                  </TableCell>
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} sx={{ py: 5 }} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} sx={{ py: 5 }} align="center">
                    No result found
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => {
                  const id = row[rowIdKey]
                  const selected = isSelected(id)
                  return (
                    <TableRow
                      hover
                      aria-checked={selected}
                      tabIndex={-1}
                      key={id}
                      selected={selected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(e) => handleClick(e, id)}
                          color="primary"
                          checked={selected}
                        />
                      </TableCell>
                      {columns.map((col) => (
                        <TableCell
                          key={String(col.key)}
                          align={col.numeric ? 'right' : 'left'}
                        >
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </TableCell>
                      ))}
                      {getRowActions && (
                        <TableCell align="right">
                          <RowActions
                            row={row}
                            actions={getRowActions?.(row) ?? []}
                            onActionClick={onActionClick}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10))
            setPage(0)
          }}
          ActionsComponent={TablePaginationActions}
        />
      </Paper>
    </Box>
  )
}
