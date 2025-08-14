"use client";

import React, { useEffect } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemText,
  useMediaQuery,
  Toolbar,
  Divider,
  // Icon,
  Box,
  Avatar,
} from "@mui/material";
import { Menu } from "@/types/menu";
import NavRenderer, { isChildActive } from "./nav-renderer";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import useMenuStore from "@/store/menu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useCompany } from "@/hooks/use-company";
import SidebarIcon from "../icon/sidebar-icon";

const drawerWidth = 260;
const collapsedWidth = 60;

const Sidebar = () => {
  const auth = useAuth();
  const theme = useTheme();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(!isMobile);
  const { sidebar, setSidebar, setActiveMenu } = useMenuStore();
  const { company, fetchCompany } = useCompany();

  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = React.useCallback(
    (url: string) => pathname.startsWith(url),
    [pathname]
  );

  const handleToggle = (id: string) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  React.useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/menu?sidebar=true");
        const data = (await res.json()).data;

        setSidebar(data);
      } catch (err) {
        console.error("Error loading menus", err);
      } finally {
        setLoading(false);
      }
    };

    if (sidebar.length === 0 || !sidebar) fetchMenus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebar.length, sidebar, loading, auth.user]);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  React.useEffect(() => {
    const findActiveParent = (menus: Menu[]): string | null => {
      for (const menu of menus) {
        if (menu.children?.length) {
          if (isChildActive(menu.children, isActive)) {
            return menu.id;
          }
        }
      }
      return null;
    };

    if (!openMenu && sidebar.length > 0) {
      const activeParent = findActiveParent(sidebar);
      if (activeParent) setOpenMenu(activeParent);
    }
  }, [sidebar, isActive, openMenu]);

  React.useEffect(() => {
    const findOpenParent = (
      menus: Menu[],
      currentPath: string
    ): string | null => {
      for (const menu of menus) {
        const fullPath = `/${menu.path || ""}`;
        if (menu.children?.length) {
          const found = findOpenParent(menu.children, currentPath);
          if (found) return menu.id;
        } else {
          if (fullPath === currentPath) {
            return null;
          }
        }
      }
      return null;
    };

    const parentToOpen = findOpenParent(sidebar, pathname);
    setOpenMenu(parentToOpen);
  }, [pathname, sidebar]);

  return (
    <>
      <Drawer
        variant="permanent"
        open={open}
        slotProps={{
          paper: {
            sx: {
              position: "relative",
              width: open ? drawerWidth : collapsedWidth,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              whiteSpace: "nowrap",
            },
          },
        }}
      >
        <Toolbar
          sx={{
            justifyContent: open ? "space-between" : "center",
            px: 2,
          }}
        >
          {open && (
            <Link href="/dashboard">
              {company?.logo ? (
                <Box>
                  <Avatar
                    variant="square"
                    src={company?.logo || ""}
                    alt="logo"
                    className="object-fit-cover object-center"
                    sx={{ width: 30, height: 30 }}
                  />
                </Box>
              ) : (
                <ListItemText
                  primary="Toma POS"
                  primaryTypographyProps={{
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                />
              )}
            </Link>
          )}
          <IconButton onClick={() => setOpen((prev) => !prev)}>
            {/* <Icon>{open ? "left_panel_close" : "right_panel_close"}</Icon> */}
            <SidebarIcon width={20} height={20} />
          </IconButton>
        </Toolbar>

        <Divider />
        <List disablePadding sx={{ pl: 0, flexGrow: 1 }}>
          {!loading && (
            <NavRenderer
              menus={sidebar as Menu[]}
              isActive={isActive}
              openMenu={openMenu}
              onToggle={handleToggle}
              sidebarOpen={open}
              setActiveMenu={setActiveMenu}
            />
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
