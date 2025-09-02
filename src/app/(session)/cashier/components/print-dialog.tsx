"use client"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material"
import { Print as PrintIcon, Close as CloseIcon } from "@mui/icons-material"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Receipt } from "./receipt"
import { TransactionResult } from "@/types/cashier"

interface PrintDialogProps {
  open: boolean
  transaction: TransactionResult | null
  onClose: () => void
  formatCurrency: (amount: number) => string
}

export function PrintDialog({ open, transaction, onClose, formatCurrency }: PrintDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Struk-${transaction?.code}`,
    onAfterPrint: () => {
      // Optional: close dialog after print
      // onClose()
    },
  })

  if (!transaction) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Print Struk</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <Receipt
            ref={receiptRef}
            transactionCode={transaction.code}
            branch={transaction.branch}
            cart={transaction.cart}
            charges={transaction.charges}
            subtotal={transaction.subtotal}
            total={transaction.total}
            paymentMethod={transaction.paymentMethod}
            paidAmount={transaction.paidAmount}
            change={transaction.change}
            cashierName={transaction.cashierName}
            date={transaction.date}
            formatCurrency={formatCurrency}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} startIcon={<CloseIcon />}>
          Tutup
        </Button>
        <Button variant="contained" onClick={handlePrint} startIcon={<PrintIcon />}>
          Print Struk
        </Button>
      </DialogActions>
    </Dialog>
  )
}
