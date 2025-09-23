import { prisma } from "@/lib/prisma"
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns"

export const getBranchAnalysis = async (date: Date, range: RangeType = 'month') => {
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
    throw new Error('Invalid range for branch analysis. Must be "month" or "year".')
  }

  const branches = await prisma.branch.findMany({
    select: {
      id: true,
      name: true,
      transactions: {
        where: {
          created_date: {
            gte: startDate,
            lte: endDate,
          }
        },
        select: {
          total: true
        }
      }
    }
  })

  const result = branches.map(branch => ({
    name: branch.name,
    totalSales: branch.transactions.reduce((acc, trx) => acc + (trx.total || 0), 0)
  }))

  return result
}