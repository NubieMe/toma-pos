/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  // Checkbox,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import React from "react";
import EnhancedTableToolbar from "./toolbar";
import { visuallyHidden } from "@mui/utils";
import { TableColumn } from "@/types/column";
import RowActions from "./actions";
import { ActionTable } from "@/types/action";
import { usePermission } from "@/hooks/use-permission";
import NoData from "../empty/no-data";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
) {
  return order === "desc"
    ? (a: Record<Key, any>, b: Record<Key, any>) =>
        descendingComparator(a, b, orderBy)
    : (a: Record<Key, any>, b: Record<Key, any>) =>
        -descendingComparator(a, b, orderBy);
}

interface DataTableProps<T extends Record<string, any>> {
  columns: TableColumn<T>[];
  rows: T[];
  rowIdKey?: keyof T;
  title?: string;
  actions?: React.ReactNode;
  onActionClick?: (action: ActionTable, row: T) => void;
  loading: boolean;
  order: "asc" | "desc";
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
  orderBy: keyof T;
  setOrderBy: React.Dispatch<React.SetStateAction<keyof T>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  total: number;
}

// Component untuk custom pagination dengan nomor halaman
function CustomPageNumbers({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const current = currentPage + 1; // Convert to 1-based

    if (totalPages <= 7) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current > 4) {
        pages.push("...");
      }

      // Show pages around current
      const start = Math.max(2, current - 1);
      const end = Math.min(totalPages - 1, current + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (current < totalPages - 3) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {/* Previous button */}
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        size="small"
        sx={{
          minWidth: 32,
          height: 32,
          "&.Mui-disabled": {
            color: "text.disabled",
          },
        }}
      >
        <ChevronLeft fontSize="small" />
      </IconButton>

      {/* Page numbers */}
      {visiblePages.map((page, index) =>
        page === "..." ? (
          <Typography
            key={index}
            variant="body2"
            sx={{ px: 1, color: "text.secondary" }}
          >
            ...
          </Typography>
        ) : (
          <Button
            key={index}
            variant={currentPage + 1 === page ? "contained" : "text"}
            onClick={() => onPageChange((page as number) - 1)}
            size="small"
            sx={{
              minWidth: 25,
              height: 25,
              fontSize: "0.875rem",
              ...(currentPage + 1 === page && {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }),
              ...(currentPage + 1 !== page && {
                color: "text.primary",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }),
            }}
          >
            {page}
          </Button>
        )
      )}

      {/* Next button */}
      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        size="small"
        sx={{
          minWidth: 32,
          height: 32,
          "&.Mui-disabled": {
            color: "text.disabled",
          },
        }}
      >
        <ChevronRight fontSize="small" />
      </IconButton>
    </Box>
  );
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  rowIdKey = "id",
  title,
  actions,
  onActionClick,
  loading,
  order,
  setOrder,
  orderBy,
  setOrderBy,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total,
}: DataTableProps<T>) {
  const { permission } = usePermission();
  const [selected, setSelected] = React.useState<readonly (string | number)[]>(
    []
  );

  const totalPages = Math.ceil(total / rowsPerPage);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row[rowIdKey]);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClick = (
    event: React.MouseEvent<unknown>,
    id: string | number
  ) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly (string | number)[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else {
      newSelected = selected.filter((s) => s !== id);
    }

    setSelected(newSelected);
  };

  const visibleRows = React.useMemo(
    () => [...rows].sort(getComparator(order, orderBy)),
    [order, orderBy, rows]
  );

  const isSelected = (id: string | number) => selected.includes(id);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          title={title}
          actions={actions}
        />
        <TableContainer>
          <Table aria-labelledby="tableTitle" style={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selected.length > 0 && selected.length < rows.length
                    }
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell> */}
                {columns.map((col, i) => (
                  <TableCell
                    key={i}
                    align={col.numeric ? "right" : "left"}
                    padding={col.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === col.key ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : "asc"}
                      onClick={(e) => handleRequestSort(e, col.key)}
                      disabled={col.disableSort ? true : false}
                    >
                      {col.label}
                      {orderBy === col.key && (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      )}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {permission.some((a) =>
                  ["print", "view", "edit", "delete"].includes(a)
                ) && (
                  <TableCell align="right">
                    <TableSortLabel disabled>Action</TableSortLabel>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 2 }, (_, i) => i).map((idx) => (
                  <TableRow key={idx}>
                    {columns.map((col, i) => (
                      <TableCell
                        key={i}
                        align={col.numeric ? "right" : "left"}
                        padding={col.disablePadding ? "none" : "normal"}
                        >
                        <Skeleton height={26} variant="rectangular" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : visibleRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 2}
                    sx={{
                      py: 5,
                    }}
                    align="center"
                  >
                    <NoData mini={false} />
                  </TableCell>
                </TableRow>
              ) : (
                visibleRows.map((row) => {
                  const id = row[rowIdKey];
                  const selected = isSelected(id);
                  return (
                    <TableRow
                      hover
                      aria-checked={selected}
                      tabIndex={-1}
                      key={id}
                      selected={selected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(e) => handleClick(e, id)}
                          color="primary"
                          checked={selected}
                        />
                      </TableCell> */}
                      {columns.map((col, i) => (
                        <TableCell
                          key={i}
                          align={col.numeric ? "right" : "left"}
                        >
                          {col.render
                            ? col.render(row[col.key], row)
                            : row[col.key]}
                        </TableCell>
                      ))}
                      {permission.some((a) =>
                        ["print", "view", "edit", "delete"].includes(a)
                      ) && (
                        <TableCell align="right">
                          <RowActions
                            row={row}
                            actions={permission}
                            onActionClick={onActionClick}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Custom Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 1,
          }}
        >
          {/* Kiri: Page X of Y */}
          <Box sx={{ fontSize: 14 }}>
            Page {page + 1} of {totalPages}
          </Box>

          {/* Tengah: Custom Page Numbers */}
          <CustomPageNumbers
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />

          {/* Kanan: Dropdown Rows per page */}
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100, 500, 1000]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={() => {}}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage=""
            labelDisplayedRows={() => ``}
            ActionsComponent={() => null}
            sx={{
              "& .MuiTablePagination-toolbar": {
                minHeight: "auto",
                p: 0,
              },
              "& .MuiTablePagination-spacer": {
                display: "none",
              },
              "& .MuiTablePagination-displayedRows": {
                display: "none",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}
