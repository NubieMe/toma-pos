import { Icon, IconButton, InputAdornment, TextField } from "@mui/material";

interface Props {
  value: string;
  setValue: (value: string) => void;
}

export default function Search({
  value,
  setValue,
}: Props) {
  return (
    <TextField
      className='w-full'
      placeholder="Search..."
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end" disablePointerEvents={value ? false : true}>
              <IconButton onClick={() => setValue('')}>
                <Icon>{value ? 'close' : 'search'}</Icon>
              </IconButton>
            </InputAdornment>
          )
        }
      }}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}