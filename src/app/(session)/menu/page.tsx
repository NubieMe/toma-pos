"use client"

import DataTable from "@/components/table/data-table"
import { TableColumn } from "@/types/column"
import React from "react"
import useMenuStore from "@/store/menu"
import MenuModal from "./modal"
import AlertDialog from "@/components/ui/alert"
import { toast } from "@/hooks/use-toast"
import { Menu } from "@/types/menu"
import { usePermission } from "@/hooks/use-permission"
import { ActionTable } from "@/types/action"
import { convertAction } from "@/utils/helper"
import { Button, Icon, IconButton, InputAdornment, TextField } from "@mui/material"

export default function Page() {
  const { permission } = usePermission()
  const [open, setOpen] = React.useState(false)
  const [openDelete, setOpenDelete] = React.useState(false)
  const [mode, setMode] = React.useState<'add' | 'edit' | 'view'>('view')
  const [data, setData] = React.useState<Menu | null>(null)
  const [loading, setLoading] = React.useState(false)
  const { menus, setMenus, deleteMenu } = useMenuStore()
  const [action, setAction] = React.useState<ActionTable[]>([])
  const [search, setSearch] = React.useState('')
  const [filtered, setFiltered] = React.useState<Menu[]>(menus || [])

  const columns: TableColumn<Menu>[] = [
    { key: 'name', label: 'Name' },
    { key: 'icon', label: 'Icon' },
    { key: 'path', label: 'Path' },
    { key: 'parent', label: 'Parent', render: (val) => val ? (val as Menu).name : '' },
    { key: 'is_active', label: 'Status', render: (val) => <span>{val ? 'Active': 'Inactive'}</span>}
  ]
  
  const handleClick = (body: Menu | null = null, modes: 'add' | 'edit' | 'view' | 'delete' = 'view') => {
    setData(body)
    if (modes === 'delete') {
      setOpenDelete(true)
    } else {
      setOpen(true)
      setMode(modes)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/menu/${data?.id}`, {
        method: 'DELETE',
      })
      
      const result = (await res.json()).message

      toast({ description: result, duration: 5000 })
      deleteMenu(data!.id)
      setData(null)
    } catch (error) {
      toast({ description: (error as Error).message, variant: 'warning', duration: 5000 })
    } finally {
      setOpenDelete(false)
    }
  }
  
  const handleSearch = (value: string) => {
    const filter = menus.filter(menu => `${menu.name} ${menu.path} ${menu.icon}`.toLowerCase().includes(value.toLowerCase()))
    setFiltered(filter)
  }
  
  React.useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/menu')
        const dat = (await res.json()).data
        setMenus(dat)
        setFiltered(dat)
      } catch (err) {
        console.error('Error loading menus', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenus()
    setAction(convertAction(permission!))
  }, [])

  React.useEffect(() => {
    handleSearch(search)
  }, [search])

  return (
    <>
      <DataTable
        loading={loading}
        columns={columns}
        rows={filtered}
        title="Menu Configuration"
        rowIdKey="id"
        getRowActions={() => action}
        actions={
          <div className="flex items-center gap-20">
            <TextField
              className='w-full'
              placeholder="Search..."
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" disablePointerEvents={search ? false : true}>
                      <IconButton onClick={() => setSearch('')}>
                        <Icon>{search ? 'close' : 'search'}</Icon>
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {permission?.create && 
              <Button onClick={() => handleClick(null, 'add')}>
                New
              </Button>
            }
          </div>
        }
        onActionClick={(action, row) => {
          if (action === 'delete') {
            setOpenDelete(true)
            setData(row)
          } else {
            handleClick(row, action)
          }
        }
      }/>
      <AlertDialog title="Delete Menu" description="Are you sure you want to delete this menu?" onConfirm={() => handleDelete()} open={openDelete} setOpen={setOpenDelete} />
      <MenuModal open={open} mode={mode} onClose={() => setOpen(false)} initialData={data!} menu={menus} />
    </>
  )
}
