import { Icon, IconButton } from "@mui/material";

interface Props {
  onClick: () => void
}

export default function Refresh({ onClick }: Props) {
  return (
    <>
      <IconButton
        onClick={onClick}
      >
        <Icon>refresh</Icon>
      </IconButton>
    </>
  )
}