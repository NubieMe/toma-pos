"use client"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Divider,
} from "@mui/material"
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material"
import { useState } from "react"
import { toCurrencyFormat } from "@/utils/helper"

interface ChargeItem {
  id: string
  name: string
  percent: boolean
  percentage: number
  amount: number
}

interface ChargesDialogProps {
  open: boolean
  charges: ChargeItem[]
  subtotalAmount: number
  onClose: () => void
  onAddCharge: (charge: Omit<ChargeItem, "id">) => void
  onUpdateCharge: (chargeId: string, charge: Partial<ChargeItem>) => void
  onRemoveCharge: (chargeId: string) => void
  formatCurrency: (amount: number) => string
}

export function ChargesDialog({
  open,
  charges,
  subtotalAmount,
  onClose,
  onAddCharge,
  onUpdateCharge,
  onRemoveCharge,
  formatCurrency,
}: ChargesDialogProps) {
  const [editingCharge, setEditingCharge] = useState<ChargeItem | null>(null)
  const [chargeName, setChargeName] = useState("")
  const [isPercent, setIsPercent] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [amount, setAmount] = useState(0)
  const [displayAmount, setDisplayAmount] = useState("0")
  const [displayPercentage, setDisplayPercentage] = useState("0")

  const resetForm = () => {
    setEditingCharge(null)
    setChargeName("")
    setIsPercent(false)
    setPercentage(0)
    setDisplayPercentage("0")
    setAmount(0)
    setDisplayAmount("0")
  }

  const handleEdit = (charge: ChargeItem) => {
    setEditingCharge(charge)
    setChargeName(charge.name)
    setIsPercent(charge.percent)
    setPercentage(charge.percentage)
    setDisplayPercentage(charge.percentage.toString())
    setAmount(charge.amount)
    setDisplayAmount(toCurrencyFormat(charge.amount))
  }

  const handleSave = () => {
    if (!chargeName.trim()) return

    const chargeData = {
      name: chargeName,
      percent: isPercent,
      percentage: isPercent ? percentage : 0,
      amount: isPercent ? 0 : amount,
    }

    if (editingCharge) {
      onUpdateCharge(editingCharge.id, chargeData)
    } else {
      onAddCharge(chargeData)
    }

    resetForm()
  }

  const getChargeAmount = (charge: ChargeItem) => {
    return charge.percent ? (subtotalAmount * charge.percentage) / 100 : charge.amount
  }

  const getTotalCharges = () => {
    return charges.reduce((total, charge) => total + getChargeAmount(charge), 0)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Kelola Biaya Tambahan</DialogTitle>
      <DialogContent>
        {/* Form Add/Edit Charge */}
        <Box sx={{ mb: 3, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {editingCharge ? "Edit Biaya" : "Tambah Biaya Baru"}
          </Typography>

          <TextField
            fullWidth
            label="Nama Biaya"
            value={chargeName}
            onChange={(e) => setChargeName(e.target.value)}
            sx={{ mb: 2 }}
            placeholder="contoh: Pajak, Service Charge, dll"
          />

          <FormControlLabel
            control={<Switch checked={isPercent} onChange={(e) => setIsPercent(e.target.checked)} />}
            label="Gunakan Persentase"
            sx={{ mb: 2 }}
          />

          {isPercent ? (
            <TextField
              fullWidth
              label="Persentase (%)"
              type="text"
              value={displayPercentage}
              onChange={(e) => {
                const value = e.target.value;
                
                const numericValue = Number(value);
                if (value === "" || value === "0" || (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100)) {
                  setDisplayPercentage(value);
                  setPercentage(numericValue || 0);
                } else {
                  setDisplayPercentage("0");
                  setPercentage(0);
                }
              }}
              slotProps={{
                htmlInput: {
                  inputMode: "decimal",
                }
              }}
              sx={{ mb: 2 }}
            />
          ) : (
            <TextField
              fullWidth
              label="Jumlah Tetap"
              value={displayAmount}
              onChange={(e) => {
                const rawValue = e.target.value;

                const cleanedValue = rawValue.replace(/[^0-9]/g, "");
                setAmount(Number(cleanedValue));
                setDisplayAmount(toCurrencyFormat(Number(cleanedValue)));
              }}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                }
              }}
              sx={{ mb: 2 }}
            />
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={handleSave} disabled={!chargeName.trim()}>
              {editingCharge ? "Update" : "Tambah"}
            </Button>
            {editingCharge && (
              <Button variant="outlined" onClick={resetForm}>
                Batal
              </Button>
            )}
          </Box>
        </Box>

        {/* List of Charges */}
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Daftar Biaya Tambahan
        </Typography>

        {charges.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
            Belum ada biaya tambahan
          </Typography>
        ) : (
          <List>
            {charges.map((charge) => (
              <ListItem
                key={charge.id}
                divider
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formatCurrency(getChargeAmount(charge))}
                    </Typography>
                    <IconButton size="small" onClick={() => handleEdit(charge)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onRemoveCharge(charge.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={charge.name}
                  secondary={
                    charge.percent
                      ? `${charge.percentage}% dari subtotal`
                      : `Jumlah tetap: ${formatCurrency(charge.amount)}`
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {charges.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1">Total Biaya Tambahan:</Typography>
              <Typography variant="subtitle1" color="primary">
                {formatCurrency(getTotalCharges())}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  )
}
