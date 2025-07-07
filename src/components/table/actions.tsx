import { Icon, IconButton, ListItemIcon, Menu, MenuItem } from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ListItemText from "@mui/material/ListItemText"
// import VisibilityIcon from "@mui/icons-material/Visibility"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import React from "react"

export default function RowActions<T>({
    row,
    actions,
    onActionClick,
  }: {
    row: T
    actions: ('edit' | 'view' | 'delete')[]
    onActionClick?: (action: 'edit' | 'view' | 'delete', row: T) => void
  }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const open = Boolean(anchorEl)
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
  
    const handleClose = () => {
      setAnchorEl(null)
    }
  
    const handleAction = (action: 'edit' | 'view' | 'delete') => {
      handleClose()
      onActionClick?.(action, row)
    }
  
    return (
      <>
        <IconButton size="small" onClick={handleClick}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          {actions.includes('view') && (
            <MenuItem onClick={() => handleAction('view')}>
              <ListItemIcon>
                <Icon fontSize="small">visibility</Icon>
              </ListItemIcon>
              <ListItemText>View</ListItemText>
            </MenuItem>
          )}
          {actions.includes('edit') && (
            <MenuItem onClick={() => handleAction('edit')}>
              <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Edit</ListItemText>
            </MenuItem>
          )}
          {actions.includes('delete') && (
            <MenuItem onClick={() => handleAction('delete')}>
              <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </>
    )
  }
  