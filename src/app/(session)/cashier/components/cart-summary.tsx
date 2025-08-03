"use client"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
} from "@mui/material"
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material"
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

interface CartSummaryProps {
  cart: CartItem[]
  charges: ChargeItem[]
  onUpdateQuantity: (stockId: string, quantity: number) => void
  onRemoveFromCart: (stockId: string) => void
  onCheckout: () => void
  onOpenCharges: () => void
  formatCurrency: (amount: number) => string
  getSubtotalAmount: () => number
  getTotalAmount: () => number
}

export function CartSummary({
  cart,
  charges,
  onUpdateQuantity,
  onRemoveFromCart,
  onCheckout,
  onOpenCharges,
  formatCurrency,
  getSubtotalAmount,
  getTotalAmount,
}: CartSummaryProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Keranjang Belanja
        </Typography>

        {cart.length === 0 ? (
          <Typography color="text.secondary">Keranjang kosong</Typography>
        ) : (
          <>
            <List>
              {cart.map((item) => (
                <ListItem key={item.stock.id} divider sx={{ flexDirection: "column", alignItems: "stretch", py: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      width: "100%",
                      mb: 1,
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                        {item.stock.item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.stock.item.code} • {formatCurrency(item.stock.price)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveFromCart(item.stock.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => onUpdateQuantity(item.stock.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQty = Number.parseInt(e.target.value) || 1
                          if (newQty > 0 && newQty <= item.stock.qty) {
                            onUpdateQuantity(item.stock.id, newQty)
                          }
                        }}
                        inputProps={{
                          min: 1,
                          max: item.stock.qty,
                          style: { textAlign: "center", width: "60px" },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: 32,
                          },
                        }}
                      />

                      <IconButton
                        size="small"
                        onClick={() => onUpdateQuantity(item.stock.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock.qty}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>

                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        / {item.stock.qty}
                      </Typography>
                    </Box>

                    <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "primary.main" }}>
                      {formatCurrency(item.subtotal)}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            {/* Subtotal */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body1">Subtotal:</Typography>
              <Typography variant="body1">{formatCurrency(getSubtotalAmount())}</Typography>
            </Box>

            {/* Charges */}
            {charges.length > 0 && (
              <>
                {charges.map((charge) => (
                  <Box key={charge.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {charge.name} {charge.percent && `(${charge.percentage}%)`}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(charge.percent ? (getSubtotalAmount() * charge.percentage) / 100 : charge.amount)}
                    </Typography>
                  </Box>
                ))}
              </>
            )}

            {/* Charges Button */}
            <Button
              fullWidth
              variant="outlined"
              size="small"
              startIcon={<ReceiptIcon />}
              onClick={onOpenCharges}
              sx={{ mb: 2 }}
            >
              {charges.length > 0 ? `Edit Biaya Tambahan (${charges.length})` : "Tambah Biaya"}
            </Button>

            {/* Total */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(getTotalAmount())}
              </Typography>
            </Box>

            <Button fullWidth variant="contained" size="large" startIcon={<PaymentIcon />} onClick={onCheckout}>
              Checkout
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
