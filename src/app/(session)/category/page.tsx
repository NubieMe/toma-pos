/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect } from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Category } from '@prisma/client'
import { format } from 'date-fns'
import CategoryModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Box, Button, Icon, IconButton, Tooltip } from '@mui/material'
import useCategory from './hooks'
import Search from '@/components/table/search'
import useTableStore from '@/store/table'
import { useDebounce } from '@/hooks/use-debounce'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    open,
    setOpen,
    data,
    fetchCategories,
    handleDelete,
    handleClick,
  } = useCategory()
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

  const columns: TableColumn<Category>[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y')},
  ]

  const query = useQuery({
    queryKey: ['categories', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchCategories,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
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
        title='Category'
        loading={query.isPending}
        columns={columns}
        rows={query.data || []}
        rowIdKey='id'
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
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
      />
      <CategoryModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete Category'
        description='Anda yakin ingin menghapus Category ini?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
