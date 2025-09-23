import { ResponseError } from "@/lib/error/response-error"
import { prisma } from "@/lib/prisma"
import { addDays, endOfMonth, endOfWeek, endOfYear, format, getMonth, isBefore, setMonth, startOfMonth, startOfWeek, startOfYear } from "date-fns"

export async function getTransaction(date: Date, range: RangeType = 'month') {
  let startDate: Date
  let endDate: Date

  if (range === 'year') {
    startDate = startOfYear(date)
    endDate = endOfYear(date)

    const monthlyData = await prisma.transaction.groupBy({
      by: ['created_date'],
      _sum: {
        total: true,
      },
      _count: {
        id: true
      },
      where: {
        created_date: {
          gte: startDate,
          lte: endDate,
        }
      },
    });

    const trxMap = new Map<number, { amount: number, qty: number }>()
    monthlyData.forEach(trx => {
      const monthKey = getMonth(trx.created_date) // 0-11
      const existing = trxMap.get(monthKey)
      if (existing) {
        existing.amount += trx._sum.total || 0
        existing.qty += trx._count.id || 0
        trxMap.set(monthKey, existing)
      } else {
        trxMap.set(monthKey, {
          amount: trx._sum.total || 0,
          qty: trx._count.id || 0,
        })
      }
    })

    const result: Array<{ date: string, amount: number, qty: number }> = []
    for (let month = 0; month < 12; month++) {
      const monthDate = setMonth(startDate, month)
      const existing = trxMap.get(month)
      result.push({
        date: format(monthDate, 'MMMM'),
        amount: existing ? existing.amount : 0,
        qty: existing ? existing.qty : 0,
      })
    }

    return result;

  } else if (range !== 'month' && range !== 'week') {
    throw new ResponseError('Invalid range. Must be "week", "month" or "year".', 400)
  } else {
    if (range === 'week') {
      startDate = startOfWeek(date)
      endDate = endOfWeek(date)
    } else {
      startDate = startOfMonth(date)
      endDate = endOfMonth(date)
    }

    const rawData = await prisma.transaction.groupBy({
      by: ['created_date'],
      _sum: {
        total: true
      },
      _count: {
        id: true
      },
      where: {
        created_date: {
          gte: startDate,
          lte: endDate,
        }
      },
      orderBy: {
        created_date: 'asc'
      }
    });
  
    const trxMap = new Map<string, { amount: number, qty: number }>()
    rawData.forEach(trx => {
      const dateKey = format(trx.created_date, 'yyyy-MM-dd')
      trxMap.set(dateKey, {
        amount: trx._sum.total || 0,
        qty: trx._count.id || 0,
      })
    })
  
    const result: Array<{ date: Date, amount: number, qty: number }> = []
    let currentDate = startDate
    while (isBefore(currentDate, endDate) || format(currentDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
  
      const existing = trxMap.get(dateKey)
      result.push({
        date: currentDate,
        amount: existing ? existing.amount : 0,
        qty: existing ? existing.qty : 0,
      })
  
      currentDate = addDays(currentDate, 1)
    }
  
    return result
  }
}

export async function getDailyTransaction(branch_id: string) {
  const now = new Date()
  const yesterday = addDays(now, -1)

  const twoDays = await prisma.transaction.groupBy({
    by: ['created_date'],
    _count: {
      id: true
    },
    where: {
      branch_id,
      created_date: {
        lte: now,
        gte: yesterday,
      }
    },
    orderBy: {
      created_date: 'asc'
    }
  })

  return { now: twoDays[0]._count.id, yesterday: twoDays[1]._count.id }
}
