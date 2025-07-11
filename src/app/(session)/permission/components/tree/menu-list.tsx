import { Menu } from "@/types/menu";
import { List, ListItemButton, ListItemText } from "@mui/material";

interface Props {
  menus: Menu[],
  selectedMenuId: string | null,
  onSelectMenu: (menu: Menu) => void,
  level?: number
}

export default function SelectableMenuTree({ menus, selectedMenuId, onSelectMenu, level = 0 }: Props) {
  return (
    <List component="div" disablePadding>
      {menus.map(menu => {
        const hasChildren = menu.children && menu.children.length > 0;
        return (
          <div key={menu.id}>
            <ListItemButton
              sx={{ pl: 2 + (level * 2) }}
              disabled={hasChildren}
              selected={selectedMenuId === menu.id}
              onClick={() => onSelectMenu(menu)}
            >
              <ListItemText
                primary={menu.name}
                slotProps={{
                  primary: {
                    typography: {
                      variant: 'body2',
                      fontWeight: hasChildren ? 'bold' : 'normal'
                    }
                  }
                }}
              />
            </ListItemButton>
            {hasChildren && (
              <SelectableMenuTree
                menus={menu.children!}
                selectedMenuId={selectedMenuId}
                onSelectMenu={onSelectMenu}
                level={level + 1}
              />
            )}
          </div>
        )
      })}
    </List>
  )
}