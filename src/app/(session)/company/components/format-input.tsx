"use client";

import { useController, Control } from "react-hook-form";
import React from 'react';
import { Stack, TextField, Typography, FormHelperText, FormControl } from '@mui/material';

interface FormatInputProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  disabled?: boolean;
}

export default function FormatInput({ name, control, disabled }: FormatInputProps) {
  const { field, fieldState: { error } } = useController({ name, control });
  
  const [formatParts, setFormatParts] = React.useState(['', '', '', '']);
  const [touchedParts, setTouchedParts] = React.useState([false, false, false, false]);

  React.useEffect(() => {
    if (field.value) {
      const parts = (field.value as string).split('-') || [];
      const fullParts = Array.from({ length: 4 }, (_, i) => parts[i] || '');
      setFormatParts(fullParts);
    }
  }, [field.value]);

  React.useEffect(() => {
    const filledParts = formatParts.filter(part => part && part.trim() !== '');
    const combinedFormat = filledParts.join('-');
    
    if (combinedFormat !== field.value) {
      field.onChange(combinedFormat);
    }
  }, [formatParts, field, field.value]);

  const handlePartChange = (index: number, value: string) => {
    const newParts = [...formatParts];
    newParts[index] = value;
    setFormatParts(newParts);
  };

  const handlePartBlur = (index: number) => {
    const newTouched = [...touchedParts];
    newTouched[index] = true;
    setTouchedParts(newTouched);
  };

  return (
    <FormControl fullWidth error={!!error}>
      <Stack direction="row" spacing={1} alignItems="center">
        {formatParts.map((part, index) => (
          <React.Fragment key={index}>
            <TextField
              value={part}
              onChange={(e) => handlePartChange(index, e.target.value)}
              onBlur={() => handlePartBlur(index)}
              variant="outlined"
              size="small"
              required={index < 2}
              label={`Part ${index + 1}`}
              disabled={disabled}
              error={(touchedParts[index] || control._formState.isSubmitted) && index < 2 && !part}
            />
            {index < formatParts.length - 1 && (
              <Typography variant="h6" component="span">-</Typography>
            )}
          </React.Fragment>
        ))}
      </Stack>
      {error && (
        <FormHelperText>{error.message}</FormHelperText>
      )}
    </FormControl>
  );
}