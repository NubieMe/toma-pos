import { ResponseError } from "@/lib/error/response-error"
import { getProducts } from "@/repositories/product"
import { getTransaction } from "@/repositories/transaction"
import { getBranchAnalysis } from "@/repositories/branch"
import { getAttendance } from "@/repositories/attendance"
import { errorHandler } from "@/utils/helper"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const date = new Date()
    const trxRange = req.nextUrl.searchParams.get('trxRange') as RangeType || 'month'
    const branchRange = req.nextUrl.searchParams.get('branchRange') as RangeType || 'month'
    const productRange = req.nextUrl.searchParams.get('productRange') as RangeType || 'month'
    const attendanceRange = req.nextUrl.searchParams.get('attendanceRange') as RangeType || 'month'

    const transactions = await getTransaction(date, trxRange)
    const products = await getProducts(date, productRange)
    const branchAnalysis = await getBranchAnalysis(date, branchRange)
    const attendance = await getAttendance(date, attendanceRange)

    return NextResponse.json({
      transactions,
      products,
      branchAnalysis,
      attendance
    })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}