/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import DataTable from "@/components/table/data-table"
import AlertDialog from "@/components/ui/alert"
import { usePermission } from "@/hooks/use-permission"
import { TableColumn } from "@/types/column"
import { Item } from "@/types/item"
import { Box, Button, Icon, IconButton, Tooltip } from "@mui/material"
import React, { useEffect } from "react"
import useItem from "./hooks"
import ItemModal from "./modal"
import Search from "@/components/table/search"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useTableStore from "@/store/table"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "@/hooks/use-toast"

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    open,
    setOpen,
    data,
    setData,
    handleClick,
    handleDelete,
    fetchItems,
  } = useItem()
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

  const columns: TableColumn<Item>[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'uom', label: 'UOM', render: (val) => val ? (val as Item['uom']).name : '' },
    { key: 'category', label: 'Category', render: (val) => val ? (val as Item['category']).name : '' },
  ]

  const query = useQuery({
    queryKey: ['items', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchItems,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['items'] })
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
  }, [])

  return (
    <>
      <DataTable
        loading={query.isPending}
        columns={columns}
        rows={query.data || []}
        title="Item Management"
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
        title="Delete Item"
        description="Anda yakin ingin menghapus Item ini?"
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
      <ItemModal open={open} onClose={() => setOpen(false)} initialData={data!} />
    </>
  )
}
