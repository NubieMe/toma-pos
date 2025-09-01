"use client"
import { ShoppingCart as CartIcon } from "@mui/icons-material"
import { Autocomplete, Box, Button, FormControl, Grid, TextField, Typography } from "@mui/material"
import { CartSummary } from "./components/cart-summary"
import { ChargesDialog } from "./components/charges-dialog"
import { CheckoutDialog } from "./components/checkout-dialog"
import { ProductList } from "./components/product-list"
import { useCashier } from "./hooks"
import useBranch from "@/hooks/use-branch"
import { Branch } from "@/types/branch"

export default function CashierPage() {
  const {
    // State
    selectedBranch,
    cart,
    charges,
    searchTerm,
    checkoutOpen,
    chargesDialogOpen,
    loading,
    paymentMethod,
    paidAmount,
    hasFilterPermission,
    filteredStocks,

    // Setters
    setSelectedBranch,
    setSearchTerm,
    setCheckoutOpen,
    setChargesDialogOpen,
    setPaymentMethod,
    setPaidAmount,

    // Actions
    addToCart,
    updateCartQuantity,
    removeFromCart,
    addCharge,
    updateCharge,
    removeCharge,
    handleCheckout,

    // Computed
    getSubtotalAmount,
    getTotalAmount,
    formatCurrency,
  } = useCashier()
  const {
    query
  } = useBranch()

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" component="h1">
          Kasir
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {hasFilterPermission ? (
            <FormControl size="small" sx={{ minWidth: 200, mt: -2 }}>
              <Autocomplete
                options={query.data || []}
                getOptionLabel={(option) => option.name}
                value={query.data?.find((b: Branch) => b.id === selectedBranch)}
                onChange={(_, newValue) => setSelectedBranch(newValue?.id || "")}
                renderInput={(params) => <TextField {...params} label="Branch" size="small" />}
              />
            </FormControl>
          ) : (
            <Typography variant="body2" sx={{ px: 2, py: 1, borderRadius: 1 }}>
              Branch: {query.data?.find((b: Branch) => b.id === selectedBranch)?.name || "Loading..."}
            </Typography>
          )}

          <Button
            variant="contained"
            startIcon={<CartIcon />}
            onClick={() => setCheckoutOpen(true)}
            disabled={cart.length === 0}
          >
            Keranjang ({cart.length})
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <ProductList
            stocks={filteredStocks}
            searchTerm={searchTerm}
            loading={loading}
            onSearchChange={setSearchTerm}
            onAddToCart={addToCart}
            formatCurrency={formatCurrency}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <CartSummary
            cart={cart}
            charges={charges}
            onUpdateQuantity={updateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckout={() => setCheckoutOpen(true)}
            onOpenCharges={() => setChargesDialogOpen(true)}
            formatCurrency={formatCurrency}
            getSubtotalAmount={getSubtotalAmount}
            getTotalAmount={getTotalAmount}
          />
        </Grid>
      </Grid>

      <ChargesDialog
        open={chargesDialogOpen}
        charges={charges}
        subtotalAmount={getSubtotalAmount()}
        onClose={() => setChargesDialogOpen(false)}
        onAddCharge={addCharge}
        onUpdateCharge={updateCharge}
        onRemoveCharge={removeCharge}
        formatCurrency={formatCurrency}
      />

      <CheckoutDialog
        open={checkoutOpen}
        cart={cart}
        charges={charges}
        paymentMethod={paymentMethod}
        paidAmount={paidAmount}
        onClose={() => setCheckoutOpen(false)}
        onPaymentMethodChange={setPaymentMethod}
        onPaidAmountChange={setPaidAmount}
        onCheckout={handleCheckout}
        formatCurrency={formatCurrency}
        getSubtotalAmount={getSubtotalAmount}
        getTotalAmount={getTotalAmount}
      />
    </Box>
  )
}
