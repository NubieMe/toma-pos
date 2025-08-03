"use client"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
  TextField,
  Alert,
} from "@mui/material"
import type { PaymentMethod } from "@prisma/client"
import { payment_method } from "@/constant/enum"
import type { Stock } from "@/types/stock"

interface CartItem {
  stock: Stock
  quantity: number
  subtotal: number
}

interface ChargeItem {
  id: string
  name: string
  percent: boolean
  percentage: number
  amount: number
}

interface CheckoutDialogProps {
  open: boolean
  cart: CartItem[]
  charges: ChargeItem[]
  paymentMethod: PaymentMethod
  paidAmount: number
  onClose: () => void
  onPaymentMethodChange: (method: PaymentMethod) => void
  onPaidAmountChange: (amount: number) => void
  onCheckout: () => void
  formatCurrency: (amount: number) => string
  getSubtotalAmount: () => number
  getTotalAmount: () => number
}

export function CheckoutDialog({
  open,
  cart,
  charges,
  paymentMethod,
  paidAmount,
  onClose,
  onPaymentMethodChange,
  onPaidAmountChange,
  onCheckout,
  formatCurrency,
  getSubtotalAmount,
  getTotalAmount,
}: CheckoutDialogProps) {
  const getChange = () => paidAmount - getTotalAmount()

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produk</TableCell>
                <TableCell align="right">Harga</TableCell>
                <TableCell align="right">Qty</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.stock.id}>
                  <TableCell>{item.stock.item.name}</TableCell>
                  <TableCell align="right">{formatCurrency(item.stock.price)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{formatCurrency(item.subtotal)}</TableCell>
                </TableRow>
              ))}

              {/* Subtotal Row */}
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "medium" }}>
                  Subtotal
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "medium" }}>
                  {formatCurrency(getSubtotalAmount())}
                </TableCell>
              </TableRow>

              {/* Charges Rows */}
              {charges.map((charge) => (
                <TableRow key={charge.id}>
                  <TableCell colSpan={3} sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                    {charge.name} {charge.percent && `(${charge.percentage}%)`}
                  </TableCell>
                  <TableCell align="right" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                    {formatCurrency(charge.percent ? (getSubtotalAmount() * charge.percentage) / 100 : charge.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              <TableRow>
                <TableCell colSpan={3} sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  Total
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                  {formatCurrency(getTotalAmount())}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">Metode Pembayaran</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => onPaymentMethodChange(e.target.value as PaymentMethod)}
              >
                {payment_method.map((m, i) => (
                  <FormControlLabel
                    key={i}
                    value={m.value}
                    control={<Radio />}
                    label={m.label}
                    className="capitalize"
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Jumlah Bayar"
              type="number"
              value={paidAmount}
              onChange={(e) => onPaidAmountChange(Number(e.target.value))}
              sx={{ mb: 2 }}
            />

            {paidAmount > 0 && (
              <Alert severity={getChange() >= 0 ? "success" : "error"}>Kembalian: {formatCurrency(getChange())}</Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Batal</Button>
        <Button variant="contained" onClick={onCheckout} disabled={paidAmount < getTotalAmount()}>
          Proses Pembayaran
        </Button>
      </DialogActions>
    </Dialog>
  )
}
