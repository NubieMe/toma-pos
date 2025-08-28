/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useEffect } from 'react'
import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { format } from 'date-fns'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Box, Button, Icon, IconButton, Tooltip } from '@mui/material'
import Search from '@/components/table/search'
import useUser from './hooks'
import { UserWithRelations as User } from '@/types/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    fetchUsers,
    handleDelete,
    handleClick,
  } = useUser()
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

  const columns: TableColumn<User>[] = [
    { key: 'username', label: 'Username' },
    { key: 'profile', label: 'Name', render: (value) => (value as User['profile'])?.name, disableSort: true },
    { key: 'branch', label: 'Branch', render: (value) => (value as User['branch'])?.name, disableSort: true },
    { key: 'role', label: 'Role', render: (value) => (value as User['role'])?.name, disableSort: true },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value as Date, 'd MMMM y')},
  ]

  const query = useQuery({
    queryKey: ['users', page, rowsPerPage, order, orderBy, debounceSearch],
    queryFn: fetchUsers,
  })

  const mutation = useMutation({
    mutationFn: handleDelete,
    onSuccess: (res) => {
      toast({ description: res.message, duration: 5000, variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
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
        title='User Management'
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
      <AlertDialog
        title='Delete User'
        description='Are you sure you want to delete this User?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', duration: 5000, variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
