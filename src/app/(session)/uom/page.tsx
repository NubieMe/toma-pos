/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import DataTable from '@/components/table/data-table'
import { TableColumn } from '@/types/column'
import { Uom } from '@prisma/client'
import { format } from 'date-fns'
import UomModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { Box, Button } from '@mui/material'
import useUom from './hooks'
import Search from '@/components/table/search'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useTableStore from '@/store/table'
import { useEffect } from 'react'
import { useDebounce } from '@/hooks/use-debounce'
import { toast } from '@/hooks/use-toast'

export default function Page() {
  const queryClient = useQueryClient()
  const { permission } = usePermission()
  const {
    open,
    setOpen,
    data,
    fetchUoms,
    handleDelete,
    handleClick,
  } = useUom()
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

  const columns: TableColumn<Uom>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y')},
  ]

  const query = useQuery({
      queryKey: ['uoms', page, rowsPerPage, order, orderBy, debounceSearch],
      queryFn: fetchUoms,
    })
  
    const mutation = useMutation({
      mutationFn: handleDelete,
      onSuccess: (res) => {
        toast({ description: res.message, duration: 5000, variant: 'success' })
        queryClient.invalidateQueries({ queryKey: ['uoms'] })
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
        title='Unit of Measurement'
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
            {permission.includes('add') && <Button onClick={() => handleClick(null, 'add')}>
              New
            </Button>}
          </Box>
        }
      />
      <UomModal
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete UOM'
        description='Are you sure you want to delete this UOM?'
        onConfirm={() => {
          toast({ description: 'Menghapus...', variant: 'info' })
          mutation.mutate()
        }}
      />
    </>
  )
}
