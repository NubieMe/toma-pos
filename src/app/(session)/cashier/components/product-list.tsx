"use client"
import { Box, Grid, Card, CardContent, Typography, TextField, Button } from "@mui/material"
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material"
import type { Stock } from "@/types/stock"

interface ProductListProps {
  stocks: Stock[]
  searchTerm: string
  loading: boolean
  onSearchChange: (value: string) => void
  onAddToCart: (stock: Stock) => void
  formatCurrency: (amount: number) => string
}

export function ProductList({
  stocks,
  searchTerm,
  loading,
  onSearchChange,
  onAddToCart,
  formatCurrency,
}: ProductListProps) {
  // Gunakan semua stocks, tidak dibatasi
  const displayedStocks = stocks

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
        </Box>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container  spacing={2}>
            {displayedStocks.map((stock) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stock.id}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {stock.item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {stock.item.code}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stock.item.category.name}
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                      {formatCurrency(stock.price)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stok: {stock.qty} {stock.item.uom.name}
                    </Typography>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => onAddToCart(stock)}
                      sx={{ mt: 2 }}
                      disabled={stock.qty === 0}
                    >
                      Tambah
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </CardContent>
    </Card>
  )
}
