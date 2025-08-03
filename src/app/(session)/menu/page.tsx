/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import DataTable from "@/components/table/data-table"
import AlertDialog from "@/components/ui/alert"
import { usePermission } from "@/hooks/use-permission"
import { TableColumn } from "@/types/column"
import { Menu } from "@/types/menu"
import { Button, Icon, IconButton, Tooltip } from "@mui/material"
import React from "react"
import useMenu from "./hooks"
import MenuModal from "./modal"
import Search from "@/components/table/search"

export default function Page() {
  const { permission } = usePermission()
  const {
    menus,
    loading,
    open,
    setOpen,
    openDelete,
    setOpenDelete,
    mode,
    data,
    setData,
    search,
    setSearch,
    handleClick,
    handleDelete,
    fetchMenus,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    total,
  } = useMenu()

  const columns: TableColumn<Menu>[] = [
    { key: 'name', label: 'Name' },
    { key: 'icon', label: 'Icon' },
    { key: 'path', label: 'Path' },
    { key: 'parent', label: 'Parent', render: (val) => val ? (val as Menu).name : '' },
    { key: 'is_active', label: 'Status', render: (val) => <span>{val ? 'Active': 'Inactive'}</span>}
  ]
  
  React.useEffect(() => {
    fetchMenus()
  }, [search, page, rowsPerPage, order, orderBy])

  return (
    <>
      <DataTable
        loading={loading}
        columns={columns}
        rows={menus}
        total={total}
        title="Menu Configuration"
        rowIdKey="id"
        actions={
          <div className="flex items-center gap-20">
            <Search
              value={search}
              setValue={setSearch}
            />
            <div className="flex gap-2">
              <Tooltip title="Refresh">
                <IconButton
                  onClick={() => {
                    setSearch('')
                    setPage(0)
                    setOrderBy('created_date')
                    setOrder('desc')
                    fetchMenus()
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
            </div>
          </div>
        }
        onActionClick={(action, row) => {
          if (action === 'delete') {
            setOpenDelete(true)
            setData(row)
          } else {
            handleClick(row, action)
          }
        }}
        order={order}
        setOrder={setOrder}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
      />
      <AlertDialog
        title="Delete Menu"
        description="Are you sure you want to delete this menu?"
        onConfirm={() => handleDelete()}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <MenuModal open={open} mode={mode} onClose={() => setOpen(false)} initialData={data!} />
    </>
  )
}
