/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import DataTable from "@/components/table/data-table"
import AlertDialog from "@/components/ui/alert"
import { useAuth } from "@/context/auth-context"
import { usePermission } from "@/hooks/use-permission"
import { TableColumn } from "@/types/column"
import { Item } from "@/types/item"
import { convertAction } from "@/utils/helper"
import { Button, Icon, IconButton, Tooltip } from "@mui/material"
import React from "react"
import useItem from "./hooks"
import ItemModal from "./modal"
import Search from "@/components/table/search"

export default function Page() {
  const { permission } = usePermission()
  const { user } = useAuth()
  const {
    items,
    loading,
    setAction,
    action,
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
    fetchItems,
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
    total,
  } = useItem()

  const columns: TableColumn<Item>[] = [
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'description', label: 'Description' },
    { key: 'uom', label: 'UOM', render: (val) => val ? (val as Item['uom']).name : '' },
    { key: 'category', label: 'Category', render: (val) => val ? (val as Item['category']).name : '' },
  ]
  
  React.useEffect(() => {
    fetchItems()
  }, [search, page, rowsPerPage, order, orderBy])

  React.useEffect(() => {
    if (permission) setAction(convertAction(permission))
  }, [user])

  return (
    <>
      <DataTable
        loading={loading}
        columns={columns}
        rows={items}
        total={total}
        title="Item Management"
        rowIdKey="id"
        getRowActions={() => action}
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
                    fetchItems()
                  }}
                >
                  <Icon>refresh</Icon>
                </IconButton>
              </Tooltip>
              {permission?.create && 
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
        title="Delete Item"
        description="Are you sure you want to delete this item?"
        onConfirm={() => handleDelete()}
        open={openDelete}
        setOpen={setOpenDelete}
      />
      <ItemModal open={open} mode={mode} onClose={() => setOpen(false)} initialData={data!} />
    </>
  )
}
