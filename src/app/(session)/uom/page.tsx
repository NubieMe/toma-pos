"use client"

import React from 'react'
import DataTable from '@/components/table/data-table'
import useUomStore from '@/store/uom'
import { TableColumn } from '@/types/column'
import { Uom } from '@prisma/client'
import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'
import UomModal from './modal'
import AlertDialog from '@/components/ui/alert'
import { usePermission } from '@/hooks/use-permission'
import { ActionTable } from '@/types/action'
import { convertAction } from '@/utils/helper'
import { Button } from '@mui/material'

export default function Page() {
  const { permission } = usePermission()
  const { uoms, setUoms, deleteUom } = useUomStore()
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Uom | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [action, setAction] = React.useState<ActionTable[]>([])

  const columns: TableColumn<Uom>[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'created_date', label: 'Created Date', render: (value) => format(value!, 'd MMMM y')},
  ]

  const handleClick = (body: Uom | null, mode: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
    setData(body)
    if (mode === 'delete') {
      setOpenDelete(true)
    } else {
      setOpen(true)
      setMode(mode)
    }
  }

  const handleDelete = async () => {
    const duration = 5000
    try {
      const res = await fetch(`/api/uom/${data?.id}`, {
        method: 'DELETE',
      })
      const result = (await res.json()).message
      toast({ description: result, duration })
      deleteUom(data!.id)
    } catch (error) {
      toast({ description: (error as Error).message, duration })
    } finally {
      setOpenDelete(false)
    }
  }

  React.useEffect(() => {
    const fetchUoms = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/uom')
        const dat = (await res.json()).data
        setUoms(dat)
      } catch (err) {
        console.error('Error loading uoms', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUoms()
    setAction(convertAction(permission!))
  }, [])

  return (
    <>
      <DataTable
        title='UOM'
        loading={loading}
        columns={columns}
        rows={uoms}
        rowIdKey='id'
        getRowActions={() => action}
        onActionClick={(action, row) => {
          handleClick(row, action)
        }}
        actions={
          (permission?.create && <Button onClick={() => handleClick(null, 'add')}>
            New
          </Button>)
        }
      />
      <UomModal
        mode={mode}
        open={open}
        onClose={() => setOpen(false)}
        initialData={data!}
      />
      <AlertDialog
        title='Delete UOM'
        description='Are you sure you want to delete this UOM?'
        setOpen={setOpenDelete}
        open={openDelete}
        onConfirm={handleDelete}
      />
    </>
  )
}
