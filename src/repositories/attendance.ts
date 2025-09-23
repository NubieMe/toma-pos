import { prisma } from "@/lib/prisma"
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns"

export const getAttendance = async (date: Date, range: RangeType = 'month') => {
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
    throw new Error('Invalid range for attendance. Must be "month" or "year".')
  }

  const totalUsers = await prisma.user.count({
    where: {
      deleted_date: null
    }
  })

  const attendedUsers = await prisma.attendance.groupBy({
    by: ['user_id'],
    where: {
      in: {
        gte: startDate,
        lte: endDate,
      }
    }
  })

  const attendedCount = attendedUsers.length
  const attendancePercentage = totalUsers > 0 ? (attendedCount / totalUsers) * 100 : 0

  return {
    totalUsers,
    attendedCount,
    attendancePercentage: parseFloat(attendancePercentage.toFixed(2))
  }
}