/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect } from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Role } from '@prisma/client'
import { format } from 'date-fns'
import RoleModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Box, Button, Icon, IconButton, Tooltip } from '@mui/material'
import useRole from './hooks'
import Search from '@/components/table/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    open,
    setOpen,
    data,
    fetchRoles,
    handleClick,
    handleDelete,
  } = useRole()
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

  const columns: TableColumn<Role>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y') },
  ]

  const query = useQuery({
    queryKey: ['roles', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchRoles,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['roles'] })
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
        rows={query.data || []}
        rowIdKey='id'
        columns={columns}
        title='Role Management'
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
      <RoleModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!} 
      />
      <AlertDialog 
        title='Delete Role'
        description='Are you sure you want to delete this role?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
