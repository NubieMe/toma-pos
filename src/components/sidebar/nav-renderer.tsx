import React from 'react'
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import Icon from '@mui/material/Icon'
import { Menu } from '@/types/menu'
import Link from 'next/link'
import { flattenMenus } from '@/utils/helper'

export function isChildActive(menus: Menu[], isActive: (url: string) => boolean): boolean {
  return menus.some(menu => {
    const path = `/${menu.path || ''}`
    if (isActive(path)) return true
    if (menu.children?.length) return isChildActive(menu.children, isActive)
    return false
  })
}

const NavRenderer = ({
  menus,
  isActive,
  openMenu,
  onToggle,
  depth = 0,
  sidebarOpen,
  setActiveMenu
}: {
  menus: Menu[]
  isActive: (url: string) => boolean
  openMenu: string | null
  onToggle: (id: string) => void
  depth?: number
  sidebarOpen: boolean
  setActiveMenu: (menu: Menu | null) => void
}) => {
  const allMenus = flattenMenus(menus)

  React.useEffect(() => {
    const matched = allMenus.find(menu => isActive(`/${menu.path || ''}`))
    if (!matched || matched.path === '') return
    setActiveMenu(matched)
  }, [menus, isActive])

  return (
    <>
      {menus.map((menu) => {
        const hasChildren = menu.children && menu.children.length > 0
        const isCollapsible = hasChildren && depth < 2
        const isTextOnly = !menu.path && !menu.icon && depth === 0
        const itemKey = menu.id
        const itemPath = `/${menu.path || ''}`
        const isSelected = isActive(itemPath)
        const isLevel3 = depth >= 2

        if (isTextOnly) {
          return (
            <React.Fragment key={itemKey}>
              {sidebarOpen && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    pl: 2,
                    py: 1,
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {menu.name}
                </Typography>
              )}
              <List disablePadding>
                <NavRenderer
                  menus={menu.children!}
                  isActive={isActive}
                  openMenu={openMenu}
                  onToggle={onToggle}
                  depth={depth + 1}
                  sidebarOpen={sidebarOpen}
                  setActiveMenu={setActiveMenu} 
                />
              </List>
            </React.Fragment>
          )
        }

        if (isCollapsible) {
          const isSelected = isChildActive(menu.children!, isActive)
          const isOpen = openMenu === menu.id || isSelected
          
          return (
            <React.Fragment key={itemKey}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (isSelected) return
                    onToggle(menu.id)
                  }}
                  sx={{
                    pl: sidebarOpen ? (depth === 0 ? 2 : 4) : 1,
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  }}
                >
                  {menu.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : 0,
                        ml: sidebarOpen ? 0 : 1,
                        justifyContent: 'center',
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.2s',
                        '.MuiListItemButton-root:hover &': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      <Icon>{menu.icon}</Icon>
                    </ListItemIcon>
                  )}
                  {sidebarOpen && <ListItemText primary={menu.name} />}
                  {sidebarOpen && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List disablePadding>
                  <NavRenderer
                    menus={menu.children!}
                    isActive={isActive}
                    openMenu={openMenu}
                    onToggle={onToggle}
                    depth={depth + 1}
                    sidebarOpen={sidebarOpen}
                    setActiveMenu={setActiveMenu} 
                  />
                </List>
              </Collapse>
            </React.Fragment>
          )
        }

        return (
          <Link href={itemPath} key={itemKey} passHref>
            <ListItem disablePadding>
              <ListItemButton
                selected={isSelected}
                sx={{
                  pl: isLevel3 ? 6 : sidebarOpen ? (depth === 0 ? 2 : 4) : 1,
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  },
                  '&:hover .dot': {
                    bgcolor: 'primary.main',
                  },
                }}
              >
                {isLevel3 ? (
                  <Box
                    className="dot"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: isSelected ? 'primary.main' : 'grey.400',
                      transition: 'all 0.2s',
                      mr: 2,
                    }}
                  />
                ) : (
                  menu.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : 0,
                        ml: sidebarOpen ? 0 : 1,
                        justifyContent: 'center',
                        color: isSelected ? 'primary.main' : 'text.secondary',
                        transition: 'color 0.2s',
                        '.MuiListItemButton-root:hover &': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      <Icon>{menu.icon}</Icon>
                    </ListItemIcon>
                  )
                )}
                {sidebarOpen && <ListItemText primary={menu.name} />}
              </ListItemButton>
            </ListItem>
          </Link>
        )
      })}
    </>
  )
}

export default NavRenderer