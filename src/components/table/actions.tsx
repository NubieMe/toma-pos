import { Box, Icon, IconButton, Tooltip } from "@mui/material"

export default function RowActions<T>({
    row,
    actions,
    onActionClick,
  }: {
    row: T
    actions: ('edit' | 'view' | 'delete')[]
    onActionClick?: (action: 'edit' | 'view' | 'delete', row: T) => void
  }) {
    return (
      <Box sx={{ gap: 0.5 }}>
        {actions.includes("view") && (
          <Tooltip title="View">
            <IconButton
              size="small"
              onClick={() => onActionClick?.("view", row)}
              color="primary"
            >
              <Icon>visibility</Icon>
            </IconButton>
          </Tooltip>
        )}

        {actions.includes("edit") && (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => onActionClick?.("edit", row)}
              color="primary"
            >
              <Icon>edit</Icon>
            </IconButton>
          </Tooltip>
        )}

        {actions.includes("delete") && (
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => onActionClick?.("delete", row)}
              color="error"
            >
              <Icon>delete_outline</Icon>
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }
  