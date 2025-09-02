"use client"
import { Box, Typography, Divider } from "@mui/material"
import { forwardRef } from "react"
import type { Stock } from "@/types/stock"
import type { Branch } from "@/types/branch"
import type { PaymentMethod } from "@prisma/client"
import { format } from "date-fns"

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

interface ReceiptProps {
  transactionCode: string
  branch: Branch
  cart: CartItem[]
  charges: ChargeItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  paidAmount: number
  change: number
  cashierName: string
  date: Date
  formatCurrency: (amount: number) => string
}

export const Receipt = forwardRef<HTMLDivElement, ReceiptProps>(
  (
    {
      transactionCode,
      branch,
      cart,
      charges,
      subtotal,
      total,
      paymentMethod,
      paidAmount,
      change,
      cashierName,
      date,
      formatCurrency,
    },
    ref,
  ) => {
    const paymentMethodLabels: Record<PaymentMethod, string> = {
      cash: "Tunai",
      qris: "QRIS",
      credit_card: "Kartu Kredit",
      debit_card: "Kartu Debit",
      transfer: "Transfer",
      emoney: "E-Money",
    }

    return (
      <Box
        ref={ref}
        sx={{
          width: "80mm", // Standard thermal printer width
          maxWidth: "300px",
          margin: "0 auto",
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "12px",
          lineHeight: 1.2,
          color: "#000",
          backgroundColor: "#fff",
          "@media print": {
            width: "80mm",
            maxWidth: "none",
            margin: 0,
            padding: "5mm",
            fontSize: "10px",
            boxShadow: "none",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }}>
            {branch.name}
          </Typography>
          {branch.address && (
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              {branch.address}
            </Typography>
          )}
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "10px" }}>
            No: {transactionCode}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "10px" }}>
            {format(date, 'dd MMM yyyy HH:mm:ss')}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "10px" }}>
            Kasir: {cashierName}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Items */}
        <Box sx={{ mb: 2 }}>
          {cart.map((item, index) => {
            const grossPrice = item.stock.price * item.quantity
            const hasDiscount = item.discount_amount > 0

            return (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontSize: "11px", fontWeight: "bold" }}>
                  {item.stock.item.name}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "10px" }}>
                  <Typography variant="body2">
                    {item.quantity} x {formatCurrency(item.stock.price)}
                  </Typography>
                  <Typography variant="body2">{formatCurrency(grossPrice)}</Typography>
                </Box>

                {/* Show discount if exists */}
                {hasDiscount && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "red" }}>
                    <Typography variant="body2">
                      Diskon {item.discount_percent ? `${item.discount_percentage.toFixed(1)}%` : ""}
                    </Typography>
                    <Typography variant="body2">-{formatCurrency(item.discount_amount)}</Typography>
                  </Box>
                )}

                {/* Show net price if there's discount */}
                {hasDiscount && (
                  <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "bold" }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">{formatCurrency(item.net_price)}</Typography>
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Totals */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              Subtotal:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>

          {charges.map((charge) => (
            <Box key={charge.id} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                {charge.name}:
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "10px" }}>
                {formatCurrency(charge.percent ? (subtotal * charge.percentage) / 100 : charge.amount)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body1" sx={{ fontSize: "12px", fontWeight: "bold" }}>
              TOTAL:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: "12px", fontWeight: "bold" }}>
              {formatCurrency(total)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              {paymentMethodLabels[paymentMethod]}:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              {formatCurrency(paidAmount)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              Kembalian:
            </Typography>
            <Typography variant="body2" sx={{ fontSize: "10px" }}>
              {formatCurrency(change)}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ fontSize: "9px" }}>
            Terima kasih atas kunjungan Anda
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "9px" }}>
            Barang yang sudah dibeli tidak dapat dikembalikan
          </Typography>
        </Box>
      </Box>
    )
  },
)

Receipt.displayName = "Receipt"
