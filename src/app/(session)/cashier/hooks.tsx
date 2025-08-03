"use client"

import React from "react"
import type { Stock } from "@/types/stock"
import type { Branch } from "@/types/branch"
import { usePermission } from "@/hooks/use-permission"
import { useAuth } from "@/context/auth-context"
import type { PaymentMethod } from "@prisma/client"

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

interface TransactionResult {
  code: string
  date: Date
  branch: Branch
  cart: CartItem[]
  charges: ChargeItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
  paidAmount: number
  change: number
  cashierName: string
}

export function useCashier() {
  const { permission } = usePermission()
  const { user } = useAuth()

  const [stocks, setStocks] = React.useState<Stock[]>([])
  const [branches, setBranches] = React.useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = React.useState<string>("")
  const [cart, setCart] = React.useState<CartItem[]>([])
  const [charges, setCharges] = React.useState<ChargeItem[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [checkoutOpen, setCheckoutOpen] = React.useState(false)
  const [chargesDialogOpen, setChargesDialogOpen] = React.useState(false)
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false)
  const [lastTransaction, setLastTransaction] = React.useState<TransactionResult | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("cash")
  const [paidAmount, setPaidAmount] = React.useState<number>(0)
  const [hasFilterPermission, setHasFilterPermission] = React.useState(false)
  const [filteredStocks, setFilteredStocks] = React.useState<Stock[]>([])

  React.useEffect(() => {
    setHasFilterPermission(permission.includes("filter"))
  }, [permission])

  React.useEffect(() => {
    fetchBranches()
  }, [])

  React.useEffect(() => {
    if (user?.branch.id) {
      setSelectedBranch(user.branch.id)
    }
  }, [user])

  React.useEffect(() => {
    if (selectedBranch) {
      fetchStocks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch])

  React.useEffect(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.vendible &&
        (stock.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.item.code.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredStocks(filtered)
  }, [stocks, searchTerm])

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branch?limit=10000")
      const { data } = await res.json()
      setBranches(data)
    } catch (error) {
      console.error("Error fetching branches:", error)
    }
  }

  const fetchStocks = async () => {
    try {
      setLoading(true)
      const filter = { vendible: true, branch_id: selectedBranch }
      const res = await fetch(`/api/stock?limit=10000&search=${JSON.stringify(filter)}`)
      const { data } = await res.json()
      setStocks(data)
    } catch (error) {
      console.error("Error fetching stocks:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (stock: Stock) => {
    const existingItem = cart.find((item) => item.stock.id === stock.id)

    if (existingItem) {
      if (existingItem.quantity < stock.qty) {
        setCart(
          cart.map((item) =>
            item.stock.id === stock.id
              ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * stock.price }
              : item,
          ),
        )
      }
    } else {
      setCart([
        ...cart,
        {
          stock,
          quantity: 1,
          subtotal: stock.price,
        },
      ])
    }
  }

  const updateCartQuantity = (stockId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(stockId)
      return
    }

    const stock = stocks.find((s) => s.id === stockId)
    if (!stock || newQuantity > stock.qty) return

    setCart(
      cart.map((item) =>
        item.stock.id === stockId ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.stock.price } : item,
      ),
    )
  }

  const removeFromCart = (stockId: string) => {
    setCart(cart.filter((item) => item.stock.id !== stockId))
  }

  const addCharge = (charge: Omit<ChargeItem, "id">) => {
    const newCharge: ChargeItem = {
      ...charge,
      id: Date.now().toString(),
    }
    setCharges([...charges, newCharge])
  }

  const updateCharge = (chargeId: string, updatedCharge: Partial<ChargeItem>) => {
    setCharges(charges.map((charge) => (charge.id === chargeId ? { ...charge, ...updatedCharge } : charge)))
  }

  const removeCharge = (chargeId: string) => {
    setCharges(charges.filter((charge) => charge.id !== chargeId))
  }

  const getSubtotalAmount = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0)
  }

  const getChargesAmount = () => {
    const subtotal = getSubtotalAmount()
    return charges.reduce((total, charge) => {
      if (charge.percent) {
        return total + (subtotal * charge.percentage) / 100
      }
      return total + charge.amount
    }, 0)
  }

  const getTotalAmount = () => {
    return getSubtotalAmount() + getChargesAmount()
  }

  const getChange = () => {
    return paidAmount - getTotalAmount()
  }

  const handleCheckout = async () => {
    try {
      const transactionData = {
        branch_id: selectedBranch,
        products: cart.map((item) => ({
          stock_id: item.stock.id,
          quantity: item.quantity,
          price: item.stock.price,
          subtotal: item.subtotal,
        })),
        charges: charges.map((charge) => ({
          name: charge.name,
          percent: charge.percent,
          percentage: charge.percentage,
          amount: charge.percent ? (getSubtotalAmount() * charge.percentage) / 100 : charge.amount,
        })),
        subtotal: getSubtotalAmount(),
        charges_total: getChargesAmount(),
        total: getTotalAmount(),
        payment_method: paymentMethod,
        paid_amount: paidAmount,
      }

      console.log("Processing transaction:", transactionData)

      // Generate transaction code (mock)
      const transactionCode = `TRX${Date.now().toString().slice(-6)}`

      // Save transaction result for printing
      const currentBranch = branches.find((b) => b.id === selectedBranch)
      if (currentBranch) {
        setLastTransaction({
          code: transactionCode,
          date: new Date(),
          branch: currentBranch,
          cart: [...cart],
          charges: [...charges],
          subtotal: getSubtotalAmount(),
          total: getTotalAmount(),
          paymentMethod,
          paidAmount,
          change: getChange(),
          cashierName: user?.profile?.name || user?.username || "Kasir",
        })
      }

      // Reset cart, charges and close dialog
      setCart([])
      setCharges([])
      setCheckoutOpen(false)
      setPaidAmount(0)

      // Show print dialog
      setPrintDialogOpen(true)

      // Refresh stocks
      fetchStocks()
    } catch (error) {
      console.error("Error processing checkout:", error)
      alert("Terjadi kesalahan saat memproses transaksi")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  return {
    // State
    stocks,
    branches,
    selectedBranch,
    cart,
    charges,
    searchTerm,
    checkoutOpen,
    chargesDialogOpen,
    printDialogOpen,
    lastTransaction,
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
    setPrintDialogOpen,
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
    getChargesAmount,
    getTotalAmount,
    getChange,
    formatCurrency,
  }
}
