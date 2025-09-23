import { prisma } from "@/lib/prisma"
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns"

export const getProducts = async (date: Date, range: RangeType = 'month') => {
  let startDate: Date
  let endDate: Date

  if (range === 'week') {
    startDate = startOfWeek(date)
    endDate = endOfWeek(date)
  } else if (range === 'month') {
    startDate = startOfMonth(date)
    endDate = endOfMonth(date)
  } else if (range === 'year') {
    startDate = startOfYear(date)
    endDate = endOfYear(date)
  } else {
    throw new Error('Invalid range for products. Must be "month" or "year".')
  }

  const products = await prisma.product.groupBy({
    by: ['stock_id'],
    _sum: {
      qty: true,
      subtotal: true
    },
    where: {
      created_date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      _sum: {
        qty: 'desc',
      },
    },
  })

  const productDetails = await prisma.stock.findMany({
    where: {
      id: {
        in: products.map(p => p.stock_id)
      }
    },
    select: {
      id: true,
      item: {
        select: {
          name: true
        }
      }
    }
  })

  const result = products.map(p => {
    const detail = productDetails.find(d => d.id === p.stock_id)
    return {
      name: detail?.item.name || 'Unknown',
      totalQty: p._sum.qty || 0,
      totalSales: p._sum.subtotal || 0
    }
  })

  return result
}