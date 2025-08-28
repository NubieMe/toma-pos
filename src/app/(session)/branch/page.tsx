'use client'

import DataTable from '@/components/table/data-table'
import { usePermission } from '@/hooks/use-permission'
import { TableColumn } from '@/types/column'
import { Branch } from '@/types/branch'
import React, { useEffect } from 'react'
import useBranch from './hooks'
import Search from '@/components/table/search'
import { Box, Button, Icon, IconButton, Tooltip } from '@mui/material'
import AlertDialog from '@/components/ui/alert'
import BranchModal from './modal'
import useTableStore from '@/store/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    data,
    fetchBranches,
    handleDelete,
    handleClick,
    open,
    setOpen,
  } = useBranch()
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

  const columns: TableColumn<Branch>[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Shorts' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'coordinate', label: 'Coordinate', render: (value) => Array.isArray(value) && value?.map(val => String(val)).join(', ') },
  ]

  const query = useQuery({
    queryKey: ['branches', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchBranches,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['branches'] })
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
        title='Branch'
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
      <BranchModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete Branch'
        description='Anda yakin ingin menghapus Branch ini?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
