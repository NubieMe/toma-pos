"use client";
import React from "react";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import Icon from "@mui/material/Icon";
import { Menu as MenuType } from "@/types/menu";
import Link from "next/link";
import { flattenMenus } from "@/utils/helper";

export function isChildActive(
  menus: MenuType[],
  isActive: (url: string) => boolean
): boolean {
  return menus.some((menu) => {
    const path = `/${menu.path || ""}`;
    if (isActive(path)) return true;
    if (menu.children?.length) return isChildActive(menu.children, isActive);
    return false;
  });
}

const DropdownMenuItem = ({
  menu,
  isActive,
  onClose,
  depth = 0,
}: {
  menu: MenuType;
  isActive: (url: string) => boolean;
  onClose: () => void;
  depth?: number;
}) => {
  const itemPath = `/${menu.path || ""}`;
  const isSelected = isActive(itemPath);
  const hasChildren = menu.children && menu.children.length > 0;

  if (!menu.path && !menu.icon && hasChildren) {
    return (
      <>
        <MenuItem
          disabled
          sx={{ py: 0.5, fontSize: "0.75rem", fontWeight: "bold" }}
        >
          {menu.name}
        </MenuItem>
        {menu.children?.map((child) => (
          <DropdownMenuItem
            key={child.id}
            menu={child}
            isActive={isActive}
            onClose={onClose}
            depth={depth + 1}
          />
        ))}
        <Divider />
      </>
    );
  }

  if (hasChildren) {
    return (
      <>
        <MenuItem disabled sx={{ pl: depth * 2 + 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            {menu.icon && (
              <Icon sx={{ mr: 1, fontSize: "1rem" }}>{menu.icon}</Icon>
            )}
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {menu.name}
            </Typography>
          </Box>
        </MenuItem>
        {menu.children?.map((child) => (
          <DropdownMenuItem
            key={child.id}
            menu={child}
            isActive={isActive}
            onClose={onClose}
            depth={depth + 1}
          />
        ))}
      </>
    );
  }

  return (
    <Link href={itemPath} passHref>
      <MenuItem
        onClick={onClose}
        selected={isSelected}
        sx={{
          pl: depth * 2 + 1,
          "&.Mui-selected": {
            backgroundColor: "action.selected",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          {depth >= 2 ? (
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: isSelected ? "primary.main" : "grey.400",
                mr: 1,
              }}
            />
          ) : (
            menu.icon && (
              <Icon
                sx={{
                  mr: 1,
                  fontSize: "1rem",
                  color: isSelected ? "primary.main" : "text.secondary",
                }}
              >
                {menu.icon}
              </Icon>
            )
          )}
          <Typography variant="body2">{menu.name}</Typography>
        </Box>
      </MenuItem>
    </Link>
  );
};

const NavRenderer = ({
  menus,
  isActive,
  openMenu,
  onToggle,
  depth = 0,
  sidebarOpen,
  setActiveMenu,
}: {
  menus: MenuType[];
  isActive: (url: string) => boolean;
  openMenu: string | null;
  onToggle: (id: string) => void;
  depth?: number;
  sidebarOpen: boolean;
  setActiveMenu: (menu: MenuType | null) => void;
}) => {
  const allMenus = flattenMenus(menus);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dropdownMenu, setDropdownMenu] = React.useState<MenuType | null>(null);

  React.useEffect(() => {
    const matched = allMenus.find(
      (menu) =>
        (!menu.children || menu.children.length === 0) &&
        isActive(`/${menu.path || ""}`)
    );
    if (!matched || matched.path === "") return;
    setActiveMenu(matched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menus, isActive]);

  const handleDropdownOpen = (
    event: React.MouseEvent<HTMLElement>,
    menu: MenuType
  ) => {
    setAnchorEl(event.currentTarget);
    setDropdownMenu(menu);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
    setDropdownMenu(null);
  };

  return (
    <>
      {menus.map((menu) => {
        const hasChildren = menu.children && menu.children.length > 0;
        const isCollapsible = hasChildren && depth < 2;
        const isTextOnly = !menu.path && !menu.icon && depth === 0;
        const itemKey = menu.id;
        const itemPath = `/${menu.path || ""}`;
        const isSelected = isActive(itemPath);
        const isLevel3 = depth >= 2;

        if (isTextOnly) {
          return (
            <React.Fragment key={itemKey}>
              {sidebarOpen && (
                <Typography
                  variant="subtitle2"
                  sx={{
                    pl: 2,
                    py: 1,
                    fontWeight: "bold",
                    color: "text.secondary",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
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
          );
        }

        if (isCollapsible) {
          const isMenuSelected = isChildActive(menu.children!, isActive);
          const isOpen = openMenu === menu.id || isMenuSelected;

          return (
            <React.Fragment key={itemKey}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={(e) => {
                    if (!sidebarOpen && hasChildren) {
                      handleDropdownOpen(e, menu);
                    } else {
                      if (isMenuSelected) return;
                      onToggle(menu.id);
                    }
                  }}
                  sx={{
                    pl: sidebarOpen ? (depth === 0 ? 2 : 4) : 1,
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                  }}
                >
                  {menu.icon && (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 2 : 0,
                        ml: sidebarOpen ? 0 : 1,
                        justifyContent: "center",
                        color: isMenuSelected
                          ? "primary.main"
                          : "text.secondary",
                        transition: "color 0.2s",
                        ".MuiListItemButton-root:hover &": {
                          color: "primary.main",
                        },
                      }}
                    >
                      {sidebarOpen ? (
                        <Icon>{menu.icon}</Icon>
                      ) : (
                        <Tooltip title={menu.name} placement="right">
                          <Icon>{menu.icon}</Icon>
                        </Tooltip>
                      )}
                    </ListItemIcon>
                  )}
                  {sidebarOpen && <ListItemText primary={menu.name} />}
                  {sidebarOpen && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {sidebarOpen && (
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
              )}
            </React.Fragment>
          );
        }

        return (
          <Link href={itemPath} key={itemKey} passHref>
            <ListItem disablePadding>
              <ListItemButton
                selected={isSelected}
                sx={{
                  pl: isLevel3 ? 6 : sidebarOpen ? (depth === 0 ? 2 : 4) : 1,
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  },
                  "&:hover .dot": {
                    bgcolor: "primary.main",
                  },
                }}
              >
                {isLevel3 ? (
                  <Box
                    className="dot"
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: isSelected ? "primary.main" : "grey.400",
                      transition: "all 0.2s",
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
                        justifyContent: "center",
                        color: isSelected ? "primary.main" : "text.secondary",
                        transition: "color 0.2s",
                        ".MuiListItemButton-root:hover &": {
                          color: "primary.main",
                        },
                      }}
                    >
                      <Tooltip title={menu.name} placement="right">
                        <Icon>{menu.icon}</Icon>
                      </Tooltip>
                    </ListItemIcon>
                  )
                )}
                {sidebarOpen && <ListItemText primary={menu.name} />}
              </ListItemButton>
            </ListItem>
          </Link>
        );
      })}

      {/* Dropdown Menu untuk sidebar yang tertutup */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        className="ml-1"
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 200,
              maxHeight: 400,
              overflow: "auto",
            },
          },
        }}
      >
        {dropdownMenu?.children?.map((child) => (
          <DropdownMenuItem
            key={child.id}
            menu={child}
            isActive={isActive}
            onClose={handleDropdownClose}
          />
        ))}
      </Menu>
    </>
  );
};

export default NavRenderer;
