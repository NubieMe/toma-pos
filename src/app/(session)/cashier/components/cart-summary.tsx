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
  FormControlLabel,
  Switch,
} from "@mui/material"
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
} from "@mui/icons-material"
import { useState } from "react"
import type { Stock } from "@/types/stock"
import { toCurrencyFormat } from "@/utils/helper"

interface CartItem {
  stock: Stock
  quantity: number
  subtotal: number
  discount_percent: boolean
  discount_percentage: number
  discount_amount: number
  net_price: number
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
  onUpdateDiscount: (
    stockId: string,
    discountData: {
      discount_percent: boolean
      discount_percentage: number
      discount_amount: number
    },
  ) => void
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
  onUpdateDiscount,
  onRemoveFromCart,
  onCheckout,
  onOpenCharges,
  formatCurrency,
  getSubtotalAmount,
  getTotalAmount,
}: CartSummaryProps) {
  const [discountInputs, setDiscountInputs] = useState<
    Record<
      string,
      {
        displayAmount: string
        displayPercentage: string
      }
    >
  >({})

  const handleDiscountChange = (item: CartItem, field: "percentage" | "amount", value: string) => {
    const stockId = item.stock.id
    const grossPrice = item.stock.price * item.quantity

    // Update display input
    const currentInputs = discountInputs[stockId] || {
      displayAmount: toCurrencyFormat(item.discount_amount),
      displayPercentage: item.discount_percentage.toString(),
    }

    if (field === "percentage") {
      const numericValue = Number(value)
      if (value === "" || value === "0" || (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100)) {
        currentInputs.displayPercentage = value
        setDiscountInputs({ ...discountInputs, [stockId]: currentInputs })

        const percentage = numericValue || 0
        const amount = (grossPrice * percentage) / 100

        onUpdateDiscount(stockId, {
          discount_percent: true,
          discount_percentage: percentage,
          discount_amount: amount,
        })
      }
    } else {
      const cleanedValue = value.replace(/[^0-9]/g, "")
      const numericValue = Number(cleanedValue)

      currentInputs.displayAmount = toCurrencyFormat(numericValue)
      setDiscountInputs({ ...discountInputs, [stockId]: currentInputs })

      const percentage = grossPrice > 0 ? (numericValue / grossPrice) * 100 : 0

      onUpdateDiscount(stockId, {
        discount_percent: false,
        discount_percentage: percentage,
        discount_amount: numericValue,
      })
    }
  }

  const handleDiscountTypeChange = (item: CartItem, isPercent: boolean) => {
    const stockId = item.stock.id
    onUpdateDiscount(stockId, {
      discount_percent: isPercent,
      discount_percentage: item.discount_percentage,
      discount_amount: item.discount_amount,
    })
  }

  const getDiscountInput = (item: CartItem) => {
    const stockId = item.stock.id
    return (
      discountInputs[stockId] || {
        displayAmount: toCurrencyFormat(item.discount_amount),
        displayPercentage: item.discount_percentage.toString(),
      }
    )
  }

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
              {cart.map((item) => {
                const discountInput = getDiscountInput(item)

                return (
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
                        {item.discount_amount > 0 && (
                          <Typography variant="body2" color="error">
                            Diskon: -{formatCurrency(item.discount_amount)}
                            {item.discount_percent && ` (${item.discount_percentage.toFixed(1)}%)`}
                          </Typography>
                        )}
                      </Box>
                      <IconButton size="small" color="error" onClick={() => onRemoveFromCart(item.stock.id)}>
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
                          slotProps={{
                            htmlInput: {
                              min: 1,
                              max: item.stock.qty,
                              style: { textAlign: "center", width: "60px" },
                            },
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

                      <Box sx={{ textAlign: "right" }}>
                        {item.discount_amount > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                            {formatCurrency(item.stock.price * item.quantity)}
                          </Typography>
                        )}
                        <Typography variant="subtitle1" sx={{ fontWeight: "medium", color: "primary.main" }}>
                          {formatCurrency(item.net_price)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Discount Section - Always Visible */}
                    <Box sx={{ mt: 2, ml: 2, display: "flex", gap: 2, alignItems: "center" }}>
                      {item.discount_percent ? (
                        <TextField
                          size="small"
                          label="Diskon (%)"
                          value={discountInput.displayPercentage}
                          onChange={(e) => handleDiscountChange(item, "percentage", e.target.value)}
                          slotProps={{
                            htmlInput: {
                              inputMode: "decimal",
                              style: { width: "120px" },
                            },
                          }}
                        />
                      ) : (
                        <TextField
                          size="small"
                          label="Diskon (Rp)"
                          value={discountInput.displayAmount}
                          onChange={(e) => handleDiscountChange(item, "amount", e.target.value)}
                          slotProps={{
                            htmlInput: {
                              inputMode: "numeric",
                              style: { width: "120px" },
                            },
                          }}
                        />
                      )}

                      <FormControlLabel
                        control={
                          <Switch
                            checked={item.discount_percent}
                            onChange={(e) => handleDiscountTypeChange(item, e.target.checked)}
                          />
                        }
                        label="Persen"
                        sx={{ ml: 5 }}
                      />
                    </Box>
                  </ListItem>
                )
              })}
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
