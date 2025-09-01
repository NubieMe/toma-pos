"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItemText,
  useMediaQuery,
  Toolbar,
  Divider,
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
import useSidebarStore from "@/hooks/use-sidebar";

const drawerWidth = 260;
const collapsedWidth = 60;

const Sidebar = () => {
  const auth = useAuth();
  const theme = useTheme();
  const pathname = usePathname();
  const { 
    open,
    mobileOpen,
    toggleMobileOpen,
    setOpenMenu,
  } = useSidebarStore();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const { sidebar, setSidebar } = useMenuStore();
  const { company, fetchCompany } = useCompany();

  useEffect(() => {
    fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isActive = useCallback(
    (url: string) => pathname.startsWith(url),
    [pathname]
  );

  useEffect(() => {
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

  useEffect(() => {
    const expandActiveMenus = (menus: Menu[], acc: string[] = []): string[] => {
      for (const menu of menus) {
        const fullPath = `/${menu.path || ""}`;

        if (menu.children?.length) {
          if (isChildActive(menu.children, isActive) || fullPath === pathname) {
            acc.push(menu.id);
            expandActiveMenus(menu.children, acc);
          }
        }

        if (fullPath === pathname) {
          acc.push(menu.id);
        }
      }
      return acc;
    };

    if (sidebar.length > 0) {
      setOpenMenu(expandActiveMenus(sidebar));
    }
  }, [pathname, sidebar, isActive, setOpenMenu]);

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : open}
        onClose={toggleMobileOpen}
        ModalProps={{
          keepMounted: true,
        }}
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
          {/* {open && ( */}
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
              ) : open && (
                <ListItemText
                  primary="Toma POS"
                  slotProps={{
                    primary: {
                      fontSize: 20,
                      fontWeight: "bold",
                    }
                  }}
                />
              )}
            </Link>
          {/* )} */}
        </Toolbar>

        <Divider />
        <List disablePadding sx={{ pl: 0, flexGrow: 1 }}>
          {!loading && (
            <NavRenderer
              menus={sidebar as Menu[]}
              isActive={isActive}
              sidebarOpen={open}
            />
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
