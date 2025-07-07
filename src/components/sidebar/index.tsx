"use client"

import React from 'react'
import {
  Drawer,
  IconButton,
  List,
  ListItemText,
  useMediaQuery,
  Toolbar,
  Divider,
  Icon,
  ListItem,
  ListItemIcon,
} from '@mui/material'
import { Menu } from '@/types/menu'
import NavRenderer, { isChildActive } from './nav-renderer'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import useMenuStore from '@/store/menu'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/auth-context'

const drawerWidth = 260
const collapsedWidth = 60

const Sidebar = () => {
  const auth = useAuth()
  const theme = useTheme()
  const pathname = usePathname()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = React.useState(false)
  const [openMenu, setOpenMenu] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(!isMobile)
  const { sidebar, setSidebar, setActiveMenu } = useMenuStore()

  const isActive = React.useCallback(
    (url: string) => pathname.startsWith(url),
    [pathname]
  )  

  const handleToggle = (id: string) => {
    setOpenMenu(prev => (prev === id ? null : id))
  }

  const handleLogout = async () => {
    await fetch('/api/logout', {
      method: 'POST',
    })

    auth.logout()
  }
  
  React.useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/menu?sidebar=true')
        const data = (await res.json()).data
  
        setSidebar(data)
      } catch (err) {
        console.error('Error loading menus', err)
      } finally {
        setLoading(false)
      }
    }

    if (sidebar.length === 0 || !sidebar) fetchMenus()
  }, [sidebar.length, sidebar, loading, auth.user])

  React.useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  React.useEffect(() => {
    // Auto open parent menu kalau ada anak yang aktif
    const findActiveParent = (menus: Menu[]): string | null => {
      for (const menu of menus) {
        if (menu.children?.length) {
          if (isChildActive(menu.children, isActive)) {
            return menu.id
          }
        }
      }
      return null
    }
  
    if (!openMenu && sidebar.length > 0) {
      const activeParent = findActiveParent(sidebar)
      if (activeParent) setOpenMenu(activeParent)
    }
  }, [sidebar, isActive, openMenu])

  React.useEffect(() => {
    const findOpenParent = (menus: Menu[], currentPath: string): string | null => {
      for (const menu of menus) {
        const fullPath = `/${menu.path || ''}`
        if (menu.children?.length) {
          // Rekursif ke anak-anak
          const found = findOpenParent(menu.children, currentPath)
          if (found) return menu.id // jika salah satu anak aktif, kembalikan ID parent
        } else {
          if (fullPath === currentPath) {
            return null // jangan return child id, biar kita cuma buka parent
          }
        }
      }
      return null
    }
  
    
    const parentToOpen = findOpenParent(sidebar, pathname)
    setOpenMenu(parentToOpen)
  }, [pathname, sidebar])

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        PaperProps={{
          sx: {
            position: 'relative',
            width: open ? drawerWidth : collapsedWidth,
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            whiteSpace: 'nowrap',
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: open ? 'space-between' : 'center',
            px: 2,
          }}
        >
          {open && (
            <Link href='/dashboard'>
              <ListItemText
                primary="Toma POS"
                primaryTypographyProps={{ fontSize: 20, fontWeight: 'bold' }}
              />
            </Link>
          )}
          <IconButton onClick={() => setOpen(prev => !prev)}>
            <Icon>{open ? "chevron_left" : "chevron_right"}</Icon>
          </IconButton>
        </Toolbar>

        <Divider />
        <List disablePadding sx={{ pl: 0, flexGrow: 1 }}>
          {!loading &&
            <NavRenderer menus={sidebar as Menu[]} isActive={isActive} openMenu={openMenu} onToggle={handleToggle} sidebarOpen={open} setActiveMenu={setActiveMenu} />}
        </List>
        <Divider />
        <Toolbar>
          <List>
            <Link href='' onClick={handleLogout}>
              <ListItem
                sx={{
                  pl: open ? 2 : 0,
                  justifyContent: open ? 'flex-start' : 'center',
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: 'center',
                    color: 'text.secondary',
                  }}
                >
                  <Icon>logout</Icon>
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Logout"
                    sx={{ ml: 1 }}
                    primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }}
                  />
                )}
              </ListItem>
            </Link>
          </List>
        </Toolbar>
      </Drawer>
    </>
  )
}

export default Sidebar
