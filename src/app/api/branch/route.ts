import { ResponseError } from "@/lib/error/response-error";
import { prisma } from "@/lib/prisma";
import { createManyStock, getStockByNotBranch } from "@/repositories/stock.server";
import { ServiceFactory } from "@/services/service-factory";
import { Session } from "@/types/session";
import { StockBody } from "@/types/stock";
import { errorHandler } from "@/utils/helper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { data, total } = await ServiceFactory.getAll('branch', req.nextUrl.searchParams)

    return NextResponse.json({ data, total })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const user = JSON.parse(req.headers.get('x-user-payload')!) as Session

    const data = await prisma.$transaction(async tx => {
      const existingCode = await prisma.branch.count({
        where: {
          code: body.code
        }
      })

      if (existingCode) {
        throw new ResponseError("Kode branch sudah ada", 400)
      }
      const created = await ServiceFactory.create('branch', body, user.id, undefined, tx)

      const stocks = await getStockByNotBranch(created.id)
      const insertBody: StockBody[] = stocks.map(s => ({
        branch_id: created.id,
        item_id: s.item_id,
        price: s.price,
        qty: 0,
        vendible: s.vendible,
        created_by: user.id,
      }))

      await createManyStock(insertBody, tx)

      return created
    })

    return NextResponse.json({ data, message: "Branch berhasil ditambahkan" }, { status: 201 })
  } catch (error) {
    return errorHandler(error as ResponseError)
  }
}