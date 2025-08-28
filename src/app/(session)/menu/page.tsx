"use client"

import DataTable from "@/components/table/data-table"
import AlertDialog from "@/components/ui/alert"
import { usePermission } from "@/hooks/use-permission"
import { TableColumn } from "@/types/column"
import { Menu } from "@/types/menu"
import { Box, Button, Icon, IconButton, Tooltip } from "@mui/material"
import useMenu from "./hooks"
import MenuModal from "./modal"
import Search from "@/components/table/search"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/hooks/use-toast"
import { useDebounce } from "@/hooks/use-debounce"
import useTableStore from "@/store/table"
import { useEffect } from "react"

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    data,
    setData,
    handleClick,
    handleDelete,
    fetchMenus,
    open,
    setOpen,
  } = useMenu()
  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    search,
    setSearch,
    setOpenAlert,
  } = useTableStore()
  const debounceSearch = useDebounce(search)

  const columns: TableColumn<Menu>[] = [
    { key: 'name', label: 'Name' },
    { key: 'icon', label: 'Icon' },
    { key: 'path', label: 'Path' },
    { key: 'parent', label: 'Parent', render: (val) => val ? (val as Menu).name : '' },
    { key: 'is_active', label: 'Status', render: (val) => <span>{val ? 'Active': 'Inactive'}</span>}
  ]

  const query = useQuery({
    queryKey: ['menus', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchMenus,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['menus'] })
    },
    onError: (err) => {
      toast({ description: err.message, duration: 5000, variant: 'warning' })
    },
    onSettled: () => {
      setOpenAlert(false)
    }
  })

  useEffect(() => {
    setSearch('')
    setPage(0)
    setOrderBy('created_date')
    setOrder('desc')
    setRowsPerPage(10)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <DataTable
        loading={query.isPending}
        columns={columns}
        rows={query.data || []}
        title="Menu Configuration"
        rowIdKey="id"
        actions={
          <Box className="flex items-center gap-20">
            <Search
              value={search}
              setValue={setSearch}
            />
            <Box className="flex gap-2">
              <Tooltip title="Refresh">
                <IconButton
                  onClick={() => {
                    setSearch('')
                    setPage(0)
                    setOrderBy('created_date')
                    setOrder('desc')
                    query.refetch()
                  }}
                >
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
              {permission.includes('add') && 
                <Button onClick={() => handleClick(null, 'add')}>
                  New
                </Button>
              }
            </Box>
          </Box>
        }
        onActionClick={(action, row) => {
          if (action === 'delete') {
            setOpenAlert(true)
            setData(row)
          } else {
            handleClick(row, action)
          }
        }}
      />
      <AlertDialog
        title="Delete Menu"
        description="Are you sure you want to delete this menu?"
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
      <MenuModal open={open} onClose={() => setOpen(false)} initialData={data!} />
    </>
  )
}
