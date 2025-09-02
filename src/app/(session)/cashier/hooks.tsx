"use client"

import { useEffect, useState } from "react"
import type { Stock } from "@/types/stock"
import type { Branch } from "@/types/branch"
import { usePermission } from "@/hooks/use-permission"
import { useAuth } from "@/context/auth-context"
import type { PaymentMethod } from "@prisma/client"
import useBranch from "@/hooks/use-branch"
import { useCompany } from "@/hooks/use-company"

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
  const { query } = useBranch()
  const { company, fetchCompany } = useCompany()

  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [charges, setCharges] = useState<ChargeItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [chargesDialogOpen, setChargesDialogOpen] = useState(false)
  const [printDialogOpen, setPrintDialogOpen] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<TransactionResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash")
  const [paidAmount, setPaidAmount] = useState<number>(0)
  const [hasFilterPermission, setHasFilterPermission] = useState(false)
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([])

  useEffect(() => {
    setHasFilterPermission(permission.includes("filter"))
  }, [permission])

  useEffect(() => {
    if (user?.branch.id) {
      setSelectedBranch(user.branch.id)
    }
  }, [user])

  useEffect(() => {
    if (selectedBranch) {
      fetchStocks()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBranch])

  useEffect(() => {
    const filtered = stocks.filter(
      (stock) =>
        stock.vendible &&
        (stock.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          stock.item.code.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredStocks(filtered)
  }, [stocks, searchTerm])

  useEffect(() => {
    if (!company) fetchCompany()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        updateCartQuantity(stock.id, existingItem.quantity + 1)
      }
    } else {
      const newItem: CartItem = {
        stock,
        quantity: 1,
        subtotal: stock.price,
        discount_percent: false,
        discount_percentage: 0,
        discount_amount: 0,
        net_price: stock.price,
      }
      setCart([...cart, newItem])
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
      cart.map((item) => {
        if (item.stock.id === stockId) {
          const grossPrice = stock.price * newQuantity
          const discountAmount = item.discount_percent
            ? (grossPrice * item.discount_percentage) / 100
            : item.discount_amount
          const netPrice = grossPrice - discountAmount

          return {
            ...item,
            quantity: newQuantity,
            subtotal: grossPrice,
            discount_amount: discountAmount,
            net_price: netPrice,
          }
        }
        return item
      }),
    )
  }

  const updateCartDiscount = (
    stockId: string,
    discountData: {
      discount_percent: boolean
      discount_percentage: number
      discount_amount: number
    },
  ) => {
    setCart(
      cart.map((item) => {
        if (item.stock.id === stockId) {
          const grossPrice = item.stock.price * item.quantity
          const netPrice = grossPrice - discountData.discount_amount

          return {
            ...item,
            ...discountData,
            net_price: netPrice,
          }
        }
        return item
      }),
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
    return cart.reduce((total, item) => total + item.net_price, 0)
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
          qty: item.quantity,
          price: item.stock.price,
          discount_percent: item.discount_percent,
          discount_percentage: item.discount_percentage,
          discount_amount: item.discount_amount,
          net_price: item.net_price,
          ppn_percentage: company?.ppn,
        })),
        charges: charges.map((charge) => ({
          name: charge.name,
          percent: charge.percent,
          percentage: charge.percentage,
          amount: charge.percent ? (getSubtotalAmount() * charge.percentage) / 100 : charge.amount,
        })),
        payment_method: paymentMethod,
        paid: paidAmount >= getTotalAmount(),
        amount: paidAmount,
      }

      console.log("Processing transaction:", transactionData)

      const response = await fetch("/api/cashier", {
        method: "POST",
        body: JSON.stringify(transactionData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Transaction failed")
      }

      // Save transaction result for printing
      const currentBranch = query.data?.find((b: Branch) => b.id === selectedBranch)
      if (currentBranch) {
        setLastTransaction({
          code: result.data.code,
          date: result.data.date,
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
    updateCartDiscount,
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
